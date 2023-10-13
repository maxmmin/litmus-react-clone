import Person from "../../model/human/person/Person";

export default interface RipePersonRelationshipsUtil {
    extractRelatedPersons (person: Person): Set<Person>;
}