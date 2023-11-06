import Person from "../../model/human/person/Person";
import OlMap from 'ol/Map';
import {GeoLocation} from "../../model/GeoLocation";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {Feature, Overlay} from "ol";
import {Entity} from "../../model/Entity";
import {LineString} from "ol/geom";
import Vector from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Popup from "ol-ext/overlay/Popup";
import {transformLocationToCoordinates} from "./mapUtilites";
import {buildUrl} from "../pureFunctions";
import appConfig from "../../config/appConfig";
import getFullName from "../functional/getFullName";

export type LabelInfo<T extends LocationAble> = {label: HTMLDivElement, labelOverlay: Overlay, entity: LocationPresent<T>, type: Entity}

export type PersonLabelRequiredFields = LocationPresent<Pick<Person, "id"|"firstName"|"middleName"|"lastName"|"media"|"location">>;

export type JurPersonLabelRequiredFields = LocationPresent<Pick<JurPerson, "id"|"name"|"media"|"location">>;

export type PersonLabelInfo = LabelInfo<PersonLabelRequiredFields>

export type JurPersonLabelInfo = LabelInfo<JurPersonLabelRequiredFields>

export type RelationsLabelsMetaData = {
    drawnPersons: PersonLabelInfo[],
    drawnJurPersons: JurPersonLabelInfo[],
    linesLayer:  VectorLayer<Vector<LineString>>,
    popup: Popup
}

export type LocationAble = {location?: GeoLocation|null};

export type LocationPresent <T extends LocationAble> = Omit<T, 'location'>&{location: GeoLocation}

export type PairCoordinates = [[number, number], [number, number]];

export default interface MapPainter {
    buildPersonLabel({person, cssAnchor}: { person: PersonLabelRequiredFields, cssAnchor?: string }): PersonLabelInfo;
    buildJurPersonLabel({jurPerson, cssAnchor=""}: {jurPerson: JurPersonLabelRequiredFields, cssAnchor?: string}): JurPersonLabelInfo;
    buildLine(coordinates: PairCoordinates): Feature<LineString>;
    putOnMap(metadata: RelationsLabelsMetaData, map: OlMap): void;
    removeFromMap(metadata: RelationsLabelsMetaData, map: OlMap): void;
    getPopup(): Popup;
}