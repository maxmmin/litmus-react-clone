import Person from "../../model/human/person/Person";
import {LocationPresent} from "../map/MapPainter";

export default interface RipePersonUtil {
    extractGeoRelatedPersons(person: Person): Set<LocationPresent<Person>>;
    filterForGeoRelatedPersons(relatedPersons: Set<LocationPresent<Person>>, ignoreList: Set<LocationPresent<Person>>): Set<LocationPresent<Person>>;
    extractRelatedPersons (person: Person): Set<Person>;
}