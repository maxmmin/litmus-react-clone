import Person from "../../model/human/person/Person";

export default interface RipePersonRelationshipsUtil {
    extractGeoRelatedPersons(person: Person): Set<Person>;
    extractRelatedPersons (person: Person): Set<Person>;
}