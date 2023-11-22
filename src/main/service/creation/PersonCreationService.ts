
import Person, {PreProcessedPerson, Relationship, RelationType} from "../../model/human/person/Person";
import Human, {HumanCreationParams} from "../../model/human/Human";
import CreationService from "./CreationService";
import Sex from "../../model/human/person/Sex";

export type RelationshipCreationParams = {
    to: Person,
    type: RelationType|null,
    note: string
}

export type PersonCreationParams = Omit<Person, 'id'|'relationships'|'sex'|keyof Human|'ownedJurPersons'|'benOwnedJurPersons'> & {
    relationships: RelationshipCreationParams[],
    sex: Sex|null
} & HumanCreationParams

interface PersonCreationService extends CreationService<PreProcessedPerson> {

}

export default PersonCreationService;