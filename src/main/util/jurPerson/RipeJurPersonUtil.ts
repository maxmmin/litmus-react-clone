import Person from "../../model/human/person/Person";
import {JurPerson} from "../../model/jurPerson/JurPerson";

export default interface RipeJurPersonUtil {
    extractGeoRelatedPersons(jurPerson: JurPerson): Set<Person>;
    extractRelatedPersons (jurPerson: JurPerson): Set<Person>;
}