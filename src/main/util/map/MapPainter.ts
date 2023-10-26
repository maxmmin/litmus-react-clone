import Person from "../../model/human/person/Person";
import OlMap from 'ol/Map';

export default interface MapPainter {
    paintPersonData (person: Person, map: OlMap): void;
}