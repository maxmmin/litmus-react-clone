import MapPainter, {
    JurPersonLabelInfo,
    JurPersonLabelRequiredFields, PairCoordinates,
    PersonLabelInfo,
    PersonLabelRequiredFields, RelationsLabelsMetaData
} from "./MapPainter";
import OlMap from "ol/Map";
import {buildUrl} from "../pureFunctions";
import appConfig from "../../config/appConfig";
import {Feature, Overlay} from "ol";
import {Entity} from "../../model/Entity";
import getFullName from "../functional/getFullName";
import {transformLocationToCoordinates} from "./mapUtil";
import Popup from "ol-ext/overlay/Popup";
import RipePersonUtil from "../person/RipePersonUtil";
import {LineString} from "ol/geom";
import {Fill, Stroke, Style} from "ol/style";
import BasicRipePersonUtil from "../person/BasicRipePersonUtil";


export default class MapPainterImpl implements MapPainter {
    private readonly _relationLineStyle = new Style({
        fill: new Fill({ color: '#6750A4' }),
        stroke: new Stroke({
            color: '#6750A4',
            width: 3,
        })
    });

    private readonly popup: Popup = new Popup({
        popupClass: "black entity-popup",
        closeBox: true,
        autoPan: true,
        anim: true,
        positioning: 'bottom-center'
    });

    get relationLineStyle(): Style {
        return this._relationLineStyle;
    }

    constructor() {
    }

    public static getInstance (): MapPainterImpl {
        return new MapPainterImpl();
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

    public buildPersonLabel({person, cssAnchor}: { person: PersonLabelRequiredFields, cssAnchor?: string }): PersonLabelInfo {
        if (!person.location) throw new Error("person has no location")

        const coordinates = transformLocationToCoordinates(person.location);

        const personContainer = this.buildPersonLabelHtmlElement({person: person, cssAnchor: cssAnchor});

        const label = new Overlay({
            element: personContainer,
            positioning: "center-center"
        });

        personContainer.onclick = (e=>{
            if (this.popup.getVisible()) {
                this.popup.hide();
            }
            this.popup.show(coordinates, `<a class="map-tooltip__person-link" href=${buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON], person.id.toString())}>${getFullName(person)}</a>`)
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

    buildLine(coordinates: PairCoordinates): Feature<LineString> {
        const line = new Feature({
            geometry: new LineString(coordinates)
        })
        line.setStyle(this.relationLineStyle);
        return line;
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

    public buildJurPersonLabel({jurPerson, cssAnchor=""}: {jurPerson: JurPersonLabelRequiredFields, cssAnchor?: string}): JurPersonLabelInfo  {
        if (!jurPerson.location) throw new Error("person has no location")

        const coordinates = transformLocationToCoordinates(jurPerson.location);

        const jurPersonContainer = this.buildJurPersonLabelHtmlElement({jurPerson: jurPerson, cssAnchor: cssAnchor});

        const label = new Overlay({
            element: jurPersonContainer,
            positioning: "center-center"
        });

        jurPersonContainer.onclick = (e=>{
            if (this.popup.getVisible()) {
                this.popup.hide();
            }
            this.popup.show(coordinates, `<a class="map-tooltip__person-link" href=${buildUrl(appConfig.applicationMappings.entityRoot[Entity.JUR_PERSON], jurPerson.id.toString())}>${jurPerson.name}</a>`)
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

    getPopup(): Popup {
        return this.popup;
    }

    putOnMap(metadata: RelationsLabelsMetaData, map: OlMap): void {
        [...metadata.drawnJurPersons,...metadata.drawnPersons].forEach(e=>map.addOverlay(e.labelOverlay));
        map.addOverlay(metadata.popup);
        map.addLayer(metadata.linesLayer);
    }

    removeFromMap(metadata: RelationsLabelsMetaData, map: OlMap): void {
        [...metadata.drawnJurPersons,...metadata.drawnPersons].map(e=>map.removeOverlay(e.labelOverlay));
        map.removeOverlay(metadata.popup);
        map.removeLayer(metadata.linesLayer);
    }

}