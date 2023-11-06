import JurPersonMapTool from "./JurPersonMapTool";
import MapUtil from "../util/MapUtil";
import MapPainter, {LocationPresent, RelationsLabelsMetaData} from "../MapPainter";
import BasicMapUtil from "../util/BasicMapUtil";
import MapPainterImpl from "../MapPainterImpl";
import Person from "../../../model/human/person/Person";
import OlMap from "ol/Map";
import RipeJurPersonUtil from "../../jurPerson/RipeJurPersonUtil";
import BasicRipeJurPersonUtil from "../../jurPerson/BasicRipeJurPersonUtil";
import {JurPerson} from "../../../model/jurPerson/JurPerson";

export default class BasicJurPersonMapTool implements JurPersonMapTool {
    constructor(protected readonly mapUtil: MapUtil,
                protected readonly mapPainter: MapPainter,
                protected readonly jurPersonUtil: RipeJurPersonUtil) {
    }

    public static getInstance(mapUtil: MapUtil = BasicMapUtil.getInstance(),
                              mapPainter: MapPainter = MapPainterImpl.getInstance(),
                              personUtil: RipeJurPersonUtil = BasicRipeJurPersonUtil.getInstance()): BasicJurPersonMapTool {
        return new BasicJurPersonMapTool(mapUtil, mapPainter, personUtil);
    }


    buildEntityMetadata(jurPerson: LocationPresent<JurPerson>): RelationsLabelsMetaData {
        const relatedPersons = this.jurPersonUtil.extractGeoRelatedPersons(jurPerson);

        const personsToDisplay: Set<LocationPresent<Person>> = new Set([...relatedPersons]);

        const metadata: RelationsLabelsMetaData = this.mapUtil.buildMetadata(personsToDisplay);

        if (metadata.drawnJurPersons.findIndex(l=>l.entity===jurPerson)===-1) {
            const jpLabel = this.mapPainter.buildJurPersonLabel({jurPerson: jurPerson});
            metadata.drawnJurPersons.push(jpLabel);
        }

        return metadata;
    }

    paintEntityData(jurPerson: LocationPresent<JurPerson>, map: OlMap): RelationsLabelsMetaData {
        const data = this.buildEntityMetadata(jurPerson);

        this.mapPainter.putOnMap(data, map);

        return data;
    }
}