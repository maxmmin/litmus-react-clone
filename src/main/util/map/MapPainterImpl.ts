import MapPainter, {
    JurPersonLabelInfo,
    JurPersonLabelRequiredFields,
    PersonLabelInfo,
    PersonLabelRequiredFields, PersonPaintMetaData
} from "./MapPainter";
import Person, {Relationship} from "../../model/human/person/Person";
import OlMap from "ol/Map";
import {buildUrl, hasLocation} from "../pureFunctions";
import appConfig from "../../config/appConfig";
import {Feature, Overlay} from "ol";
import {Entity} from "../../model/Entity";
import getFullName from "../functional/getFullName";
import {transformLocationToCoordinates} from "./mapUtil";
import Popup from "ol-ext/overlay/Popup";
import RipePersonUtil from "../relationships/RipePersonUtil";
import Vector from "ol/source/Vector";
import {LineString} from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import {Fill, Stroke, Style} from "ol/style";
import {JurPerson} from "../../model/jurPerson/JurPerson";


type LinesData = {pair: [Relationship, Relationship], line: Feature<LineString>}

type PairedRelationships = [Relationship, Relationship]

type PairedRelationshipMap = Map<string, PairedRelationships>


export default class MapPainterImpl implements MapPainter {
    private readonly _popup: Popup = new Popup({
        popupClass: "black person-popup",
        closeBox: true,
        autoPan: true,
        anim: true,
        positioning: 'bottom-center'
    })

    private readonly _relationshipLineStyle = new Style({
        fill: new Fill({ color: '#6750A4' }),
        stroke: new Stroke({
            color: '#6750A4',
            width: 3,
        })
    });


    get relationshipLineStyle(): Style {
        return this._relationshipLineStyle;
    }

    get popup(): Popup {
        return this._popup;
    }

    constructor(protected readonly relationshipsUtil: RipePersonUtil) {
    }

    private buildPersonLabelHtmlElement({person, cssAnchor=""}: {person: PersonLabelRequiredFields, cssAnchor?: string}): HTMLDivElement {
        const personContainer = document.createElement("div");
        personContainer.className = "map-entity-label map-entity-label_person "+cssAnchor;

        const imgContainer = document.createElement("div")
        imgContainer.className = 'map-entity-label__img-wrapper map-entity-label__img-wrapper_person'

        personContainer.append(imgContainer);

        const mainImg = person.media.mainImage;

        if (mainImg) {
            const personImg = document.createElement("img");
            personImg.src = buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg);
            personImg.className = "map-entity-label__img map-entity-label__img_person"
            imgContainer.append(personImg);
        } else {
            const personLetter = document.createElement("p")
            personLetter.className = "map-entity-label__img-placeholder map-entity-label__img-placeholder_person"
            personLetter.innerText = person.lastName[0];
            imgContainer.append(personLetter);
        }

        return personContainer;
    }

    private buildSinglePersonLabel({person, cssAnchor}: { person: PersonLabelRequiredFields, cssAnchor?: string }): PersonLabelInfo {
        if (!person.location) throw new Error("person has no location")

        const coordinates = transformLocationToCoordinates(person.location);

        const personContainer = this.buildPersonLabelHtmlElement({person: person, cssAnchor: cssAnchor});

        const label = new Overlay({
            element: personContainer,
            positioning: "center-center"
        });

        personContainer.onclick = (e=>{
            if (this._popup.getVisible()) {
                this._popup.hide();
            }
            this._popup.show(coordinates, `<a class="map-tooltip__person-link" href=${buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON], person.id.toString())}>${getFullName(person)}</a>`)
        })

        label.setPosition(coordinates);

        label.set("id", person.id);
        label.set("fullName", getFullName(person));

        return {
            label: personContainer,
            labelOverlay: label,
            entity: person,
            type: Entity.PERSON
        };
    }

    private buildPersonsLabels (rootPerson: Person, relatedPersons: Set<Person>): PersonLabelInfo[] {
        const labels: PersonLabelInfo[] = [...relatedPersons]
            .filter(hasLocation)
            .map(p=>this.buildSinglePersonLabel({
                person: p
            }));

        if (hasLocation(rootPerson)) {
            labels.push(this.buildSinglePersonLabel({
                person: rootPerson,
                cssAnchor: "main"
            }))
        }

        return labels;
    }

    private buildPairedMapKey(pairedId: [number, number]): string {
        return pairedId.sort((a,b)=>a-b).join("/");
    }

    private buildRelationshipLine({pair}: {pair: [Relationship, Relationship]}): LinesData  {
        const personPair = pair.map(r=>r.to);
        const [personOne, personTwo] = personPair;
        if (personOne.location&&personTwo.location) {
            const pairCoordinates: [number, number][] = personPair.map(p=>transformLocationToCoordinates(p.location!))

            const line = new Feature({
                geometry: new LineString(pairCoordinates)
            })
            line.setStyle(this.relationshipLineStyle);

            return {
                pair: pair,
                line: line
            }
        } else throw new Error(`one of persons has no location: ${pair[0].to.id}->${pair[1].to.id}`)
    }

    private buildRelationshipsLines (persons: Set<Person>): VectorLayer<Vector<LineString>> {
        const source = new Vector<LineString>({
        });

        const vectorLayer = new VectorLayer({
            source: source,
            renderBuffer: 1e6
        });

        const drawnRelationshipsMap: PairedRelationshipMap = new Map<string, PairedRelationships>();

        const linesData: LinesData[] = [];

        persons.forEach(person=>{
            person.relationships.forEach(r=>{
                const relatedPerson = r.to;
                const reverseRelation = relatedPerson.relationships.find(rel=>rel.to===person);
                if (!reverseRelation) throw new Error("corrupted schema; reversed relation was not found");
                if (!persons.has(relatedPerson)) return;

                const key = this.buildPairedMapKey([person.id, relatedPerson.id]);
                if (!drawnRelationshipsMap.has(key)) {
                    const buildData = this.buildRelationshipLine({pair: [r,reverseRelation]})
                    linesData.push(buildData);
                    drawnRelationshipsMap.set(key, [reverseRelation, r])
                }
            })
        })

        const lines = linesData.map(data=>data.line);
        source.addFeatures(lines);
        return vectorLayer;
    }

    private buildJurPersonLabelHtmlElement({jurPerson, cssAnchor=""}: {jurPerson: JurPersonLabelRequiredFields, cssAnchor: string}) {
        const jurPersonContainer = document.createElement("div");
        jurPersonContainer.className = "map-entity-label map-entity-label_jur-person "+cssAnchor;

        const imgContainer = document.createElement("div")
        imgContainer.className = 'map-entity-label__img-wrapper map-entity-label__img-wrapper_jur-person'

        jurPersonContainer.append(imgContainer);

        const mainImg = jurPerson.media.mainImage;

        if (mainImg) {
            const personImg = document.createElement("img");
            personImg.src = buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg);
            personImg.className = "map-entity-label__img map-entity-label__img_jur-person"
            imgContainer.append(personImg);
        } else {
            const personLetter = document.createElement("p")
            personLetter.className = "map-entity-label__img-placeholder map-entity-label__img-placeholder_jur-person"
            personLetter.innerText = jurPerson.name[0];
            imgContainer.append(personLetter);
        }

        return jurPersonContainer;
    }

    private buildJurPersonLabel({jurPerson, cssAnchor=""}: {jurPerson: JurPersonLabelRequiredFields, cssAnchor?: string}): JurPersonLabelInfo  {
        if (!jurPerson.location) throw new Error("person has no location")

        const coordinates = transformLocationToCoordinates(jurPerson.location);

        const jurPersonContainer = this.buildJurPersonLabelHtmlElement({jurPerson: jurPerson, cssAnchor: cssAnchor});

        const label = new Overlay({
            element: jurPersonContainer,
            positioning: "center-center"
        });

        jurPersonContainer.onclick = (e=>{
            if (this._popup.getVisible()) {
                this._popup.hide();
            }
            this._popup.show(coordinates, `<a class="map-tooltip__person-link" href=${buildUrl(appConfig.applicationMappings.entityRoot[Entity.JUR_PERSON], jurPerson.id.toString())}>${jurPerson.name}</a>`)
        })

        label.setPosition(coordinates);

        label.set("id", jurPerson.id);
        label.set("name", jurPerson.name);

        return {
            label: jurPersonContainer,
            labelOverlay: label,
            entity: jurPerson,
            type: Entity.JUR_PERSON
        };
    }

    private buildJurPersonsLabels(personsToDisplay: Set<Person>): JurPersonLabelInfo[] {
        const jurPersons = [...personsToDisplay].reduce((acc, person) => {
            const jurPersons = [...person.ownedJurPersons, ...person.benOwnedJurPersons];
            return new Set([...acc, ...jurPersons])
        }, new Set<JurPerson>())
        
        const sharedJurPersons = [...jurPersons]
            .filter(jurPerson => {
                let counter = 0;
                for (const person of personsToDisplay) {
                    if (counter>1) break;
                    if (person.benOwnedJurPersons.includes(jurPerson)||person.ownedJurPersons.includes(jurPerson)) {
                        counter++;
                    }
                }
                return counter>1;
            })
        
        return sharedJurPersons.filter(hasLocation).map(j=>this.buildJurPersonLabel({jurPerson: j}))
    }

    paintPersonData(person: Person, map: OlMap): PersonPaintMetaData {
        const relatedPersons = this.relationshipsUtil.extractGeoRelatedPersons(person);

        const personsLabels = this.buildPersonsLabels(person, relatedPersons);
        personsLabels.forEach(l=>l.labelOverlay.setMap(map))

        const personsToDisplay = new Set([person, ...relatedPersons]);

        const linesLayer = this.buildRelationshipsLines(personsToDisplay);
        map.addLayer(linesLayer);

        const jurPersonsLabels = this.buildJurPersonsLabels(personsToDisplay);
        jurPersonsLabels.forEach(l=>l.labelOverlay.setMap(map));

        return {
            drawnPersons: personsLabels,
            drawnJurPersons: jurPersonsLabels
        }
    }
}