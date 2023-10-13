import Person from "../../model/human/person/Person";

export default interface RipePersonRelationshipUtil {
    extractRelatedPersons (person: Person): Set<Person>;
}