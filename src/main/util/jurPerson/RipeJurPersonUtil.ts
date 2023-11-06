import Person from "../../model/human/person/Person";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {LocationPresent} from "../map/MapPainter";

export default interface RipeJurPersonUtil {
    extractGeoRelatedPersons(jurPerson: JurPerson): Set<LocationPresent<Person>>;
    extractRelatedPersons (jurPerson: JurPerson): Set<Person>;
}