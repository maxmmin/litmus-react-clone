import PersonMapTool from "./PersonMapTool";
import Person from "../../../model/human/person/Person";
import MapPainter, {LocationPresent, RelationsLabelsMetaData} from "../MapPainter";
import OlMap from "ol/Map";
import RipePersonUtil from "../../person/RipePersonUtil";
import MapPainterImpl from "../MapPainterImpl";
import BasicRipePersonUtil from "../../person/BasicRipePersonUtil";
import BasicMapUtil from "../util/BasicMapUtil";
import MapUtil from "../util/MapUtil";

export default class BasicPersonMapTool implements PersonMapTool {

    constructor(protected readonly mapUtil: MapUtil,
                protected readonly mapPainter: MapPainter,
                protected readonly personUtil: RipePersonUtil) {
    }

    public static getInstance(mapUtil: MapUtil = BasicMapUtil.getInstance(),
                              mapPainter: MapPainter = MapPainterImpl.getInstance(),
                              personUtil: RipePersonUtil = BasicRipePersonUtil.getInstance()): BasicPersonMapTool {
        return new BasicPersonMapTool(mapUtil, mapPainter, personUtil);
    }


    buildEntityMetadata(person: LocationPresent<Person>): RelationsLabelsMetaData {
        const relatedPersons = this.personUtil.extractGeoRelatedPersons(person);

        const personsToDisplay: Set<LocationPresent<Person>> = new Set([person, ...relatedPersons]);

        return this.mapUtil.buildMetadata(personsToDisplay);
    }

    paintEntityData(entity: LocationPresent<Person>, map: OlMap): RelationsLabelsMetaData {
        const data = this.buildEntityMetadata(entity);

        this.mapPainter.putOnMap(data, map);

        return data;
    }

}