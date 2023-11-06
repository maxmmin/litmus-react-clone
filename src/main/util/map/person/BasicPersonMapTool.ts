import PersonMapTool from "./PersonMapTool";
import Person from "../../../model/human/person/Person";
import MapPainter, {
    JurPersonLabelInfo,
    LocationPresent,
    PersonLabelInfo,
    RelationsLabelsMetaData
} from "../MapPainter";
import OlMap from "ol/Map";
import RipePersonUtil from "../../person/RipePersonUtil";
import {hasLocation} from "../../pureFunctions";
import {transformLocationToCoordinates} from "../mapUtil";
import {Feature} from "ol";
import {LineString} from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import Vector from "ol/source/Vector";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import MapPainterImpl from "../MapPainterImpl";
import BasicRipePersonUtil from "../../person/BasicRipePersonUtil";

type LinesData = {pair: Paired, line: Feature<LineString>}

type Paired = [LocationPresent<Person>, LocationPresent<Person>]

type PairedRelationshipMap = Map<string, Paired>

export default class BasicPersonMapTool implements PersonMapTool {

    constructor(protected readonly mapPainter: MapPainter,
                protected readonly relationshipsUtil: RipePersonUtil) {
    }

    public static getInstance(mapPainter: MapPainter = MapPainterImpl.getInstance(),
                              personUtil: RipePersonUtil = BasicRipePersonUtil.getInstance()): BasicPersonMapTool {
        return new BasicPersonMapTool(mapPainter, personUtil);
    }


    private buildPersonsLabels (rootPerson: Person, relatedPersons: Set<Person>): PersonLabelInfo[] {
        const labels: PersonLabelInfo[] = [...relatedPersons]
            .filter(hasLocation)
            .map(p=>this.mapPainter.buildPersonLabel({
                person: p
            }));

        if (hasLocation(rootPerson)) {
            labels.push(this.mapPainter.buildPersonLabel({
                person: rootPerson,
                cssAnchor: "main"
            }))
        }

        return labels;
    }

    private buildRelationshipLine({pair}: {pair: Paired}): LinesData  {
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

    private buildPairedMapKey(pairedId: [number, number]): string {
        return pairedId.sort((a,b)=>a-b).join("/");
    }

    private buildRelationshipsLines (persons: Set<LocationPresent<Person>>): VectorLayer<Vector<LineString>> {
        const source = new Vector<LineString>({
        });

        const vectorLayer = new VectorLayer({
            source: source,
            renderBuffer: 1e6
        });

        const drawnRelationshipsMap: PairedRelationshipMap = new Map<string, Paired>();

        const linesData: LinesData[] = [];

        persons.forEach(person=>{
            person.relationships.forEach(r=>{
                const relatedPerson = r.to;

                if (hasLocation(relatedPerson)) {
                    if (!persons.has(relatedPerson)) return;

                    const reverseRelation = relatedPerson.relationships.find(rel=>rel.to===person);
                    if (!reverseRelation) throw new Error("corrupted schema; reversed relation was not found");

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

        const lines = linesData.map(data=>data.line);
        source.addFeatures(lines);
        return vectorLayer;
    }

    private buildJurPersonsLabels(jpContainable: Set<Person>): JurPersonLabelInfo[] {
        const jurPersons = [...jpContainable].reduce((acc, person) => {
            const jurPersons = [...person.ownedJurPersons, ...person.benOwnedJurPersons];
            return new Set([...acc, ...jurPersons])
        }, new Set<JurPerson>())

        return [...jurPersons].filter(hasLocation).map(j=>this.mapPainter.buildJurPersonLabel({jurPerson: j}))
    }


    buildEntityMetadata(person: LocationPresent<Person>): RelationsLabelsMetaData {
        const relatedPersons = this.relationshipsUtil.extractGeoRelatedPersons(person);

        const personsLabels = this.buildPersonsLabels(person, relatedPersons);

        const personsToDisplay: Set<LocationPresent<Person>> = new Set([person, ...relatedPersons]);

        const linesLayer = this.buildRelationshipsLines(personsToDisplay);

        const jurPersonsLabels = this.buildJurPersonsLabels(personsToDisplay);

        return {
            drawnPersons: personsLabels,
            drawnJurPersons: jurPersonsLabels,
            linesLayer: linesLayer,
            popup: this.mapPainter.getPopup()
        }
    }

    paintEntityData(entity: LocationPresent<Person>, map: OlMap): RelationsLabelsMetaData {
        const data = this.buildEntityMetadata(entity);

        this.mapPainter.putOnMap(data, map);

        return data;
    }

}