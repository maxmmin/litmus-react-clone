import Person from "../../model/human/person/Person";
import OlMap from 'ol/Map';
import {GeoLocation} from "../../model/GeoLocation";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {Overlay} from "ol";
import {Entity} from "../../model/Entity";
import {LineString} from "ol/geom";
import Vector from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

export type LabelInfo<T> = {label: HTMLDivElement, labelOverlay: Overlay, entity: T, type: Entity}

export type PersonLabelRequiredFields = LocationPresent<Pick<Person, "id"|"firstName"|"middleName"|"lastName"|"media"|"location">>;

export type JurPersonLabelRequiredFields = LocationPresent<Pick<JurPerson, "id"|"name"|"media"|"location">>;

export type PersonLabelInfo = LabelInfo<PersonLabelRequiredFields>

export type JurPersonLabelInfo = LabelInfo<JurPersonLabelRequiredFields>

export type PersonPaintMetaData = {
    drawnPersons: PersonLabelInfo[],
    drawnJurPersons: JurPersonLabelInfo[],
    linesLayer:  VectorLayer<Vector<LineString>>
}

export type LocationPresent <T extends {location?: GeoLocation|null}> = Omit<T, 'location'>&{location: GeoLocation}

export default interface MapPainter {
    formPersonData (person: Person): PersonPaintMetaData;
    paintPersonData (person: Person, map: OlMap): PersonPaintMetaData;
}