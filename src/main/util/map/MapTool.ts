import {LocationAble, LocationPresent, RelationsLabelsMetaData} from "./MapPainter";
import OlMap from "ol/Map";

export default interface MapTool<S extends LocationAble> {
    buildEntityMetadata(entity: LocationPresent<S>): RelationsLabelsMetaData;
    paintEntityData(entity: LocationPresent<S>, map: OlMap): RelationsLabelsMetaData;
}