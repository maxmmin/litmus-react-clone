import MapPainter, {JurPersonLabelInfo, LocationPresent, PersonLabelInfo, RelationsLabelsMetaData} from "../MapPainter";
import Person from "../../../model/human/person/Person";
import {transformLocationToCoordinates} from "../mapUtilites";
import {hasLocation} from "../../pureFunctions";
import {Feature} from "ol";
import {LineString} from "ol/geom";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import VectorLayer from "ol/layer/Vector";
import Vector from "ol/source/Vector";
import MapUtil from "./MapUtil";
import MapPainterImpl from "../MapPainterImpl";


export type LineData = {pair: Paired, line: Feature<LineString>}

export type Paired = [LocationPresent<Person>, LocationPresent<Person>]

export type PairedRelationshipMap = Map<string, Paired>

export default class BasicMapUtil implements MapUtil {

    public constructor(protected readonly mapPainter: MapPainter) {
    }

    public static getInstance (mapPainter: MapPainter = MapPainterImpl.getInstance()): BasicMapUtil {
        return new BasicMapUtil(mapPainter);
    }

    buildMetadata(personsToDisplay: Set<LocationPresent<Person>>): RelationsLabelsMetaData {
        const personsLabels = this.buildPersonsLabels(personsToDisplay);

        const linesLayer = this.buildRelationsLines(personsToDisplay);

        const jurPersonsLabels = this.buildJurPersonsRelations(personsToDisplay);

        return {
            drawnPersons: personsLabels,
            drawnJurPersons: jurPersonsLabels,
            linesLayer: linesLayer,
            popup: this.mapPainter.getPopup()
        }
    }

    protected buildPersonsLabels (personsToDisplay: Set<LocationPresent<Person>>): PersonLabelInfo[] {
        return [...personsToDisplay]
            .map(p => this.mapPainter.buildPersonLabel({
                person: p
            }));
    }

    protected buildRelationshipLine({pair}: {pair: Paired}): LineData  {
        const [personOne, personTwo]: Paired = pair;
        if (personOne.location&&personTwo.location) {
            const pairCoordinates: [[number, number],[number, number]] = [transformLocationToCoordinates(pair[0].location),
                transformLocationToCoordinates(pair[1].location)]

            const line = this.mapPainter.buildLine(pairCoordinates);

            return {
                pair: pair,
                line: line
            }
        } else throw new Error(`one of persons has no location: ${pair[0].id}->${pair[1].id}`)
    }

    protected buildPairedMapKey(pairedId: [number, number]): string {
        return pairedId.sort((a,b)=>a-b).join("/");
    }

    protected buildRelationshipsLines(persons: Set<LocationPresent<Person>>): LineData[] {
        const drawnRelationshipsMap: PairedRelationshipMap = new Map<string, Paired>();

        const linesData: LineData[] = [];

        persons.forEach(person=>{
            person.relationships.forEach(r=>{
                const relatedPerson = r.to;

                if (hasLocation(relatedPerson)) {
                    if (!persons.has(relatedPerson)) return;

                    const reverseRelation = relatedPerson.relationships.find(rel=>rel.to===person);
                    if (!reverseRelation) {
                        throw new Error("corrupted schema; reversed relation was not found");
                    };

                    const reversePerson = reverseRelation.to;

                    if (hasLocation(reversePerson)) {
                        const key = this.buildPairedMapKey([person.id, relatedPerson.id]);
                        if (!drawnRelationshipsMap.has(key)) {
                            const buildData = this.buildRelationshipLine({pair: [reversePerson,relatedPerson]});
                            linesData.push(buildData);
                            drawnRelationshipsMap.set(key, [reversePerson, relatedPerson])
                        }
                    }
                }
            })
        })

        return linesData;
    }

    protected buildJurPersonsLines(persons: Set<LocationPresent<Person>>): Feature<LineString>[] {
        const data: Feature<LineString>[] = [];
        persons.forEach(person=>{
            const paintedJurPersons: Set<JurPerson> = new Set<JurPerson>();
            person.ownedJurPersons.forEach(j=>{
                if (j.location&&!paintedJurPersons.has(j)) {
                    const pairCoordinates: [[number, number],[number, number]] = [transformLocationToCoordinates(person.location),
                        transformLocationToCoordinates(j.location)]
                    const line = this.mapPainter.buildLine(pairCoordinates);
                    data.push(line);
                    paintedJurPersons.add(j)
                }
            })
        })
        return data;
    }

    protected buildRelationsLines (persons: Set<LocationPresent<Person>>): VectorLayer<Vector<LineString>> {
        const source = new Vector<LineString>({
        });

        const vectorLayer = new VectorLayer({
            source: source,
            renderBuffer: 1e6
        });

        const relationshipsLinesData: LineData[] = this.buildRelationshipsLines(persons);
        const relationshipsLines = relationshipsLinesData.map(data=>data.line);

        const jurPersonLines: Feature<LineString>[] = this.buildJurPersonsLines(persons);

        source.addFeatures(relationshipsLines);
        source.addFeatures(jurPersonLines);

        return vectorLayer;
    }

    protected buildJurPersonsRelations(jpContainable: Set<LocationPresent<Person>>): JurPersonLabelInfo[] {
        const jurPersons = [...jpContainable].reduce((acc, person) => {
            const jurPersons = [...person.ownedJurPersons, ...person.benOwnedJurPersons];
            return new Set([...acc, ...jurPersons])
        }, new Set<JurPerson>())

        return [...jurPersons].filter(hasLocation).map(j=>this.mapPainter.buildJurPersonLabel({jurPerson: j}))
    }


}