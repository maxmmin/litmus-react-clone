
import Person, {PreProcessedPerson, Relationship} from "../../model/human/person/Person";
import {NoRelationshipsPerson} from "../../redux/types/creation/PersonCreationState";
import Human, {HumanCreationParams} from "../../model/human/Human";
import CreationService from "./CreationService";
import Sex from "../../model/human/person/Sex";

export type RelationshipCreationParams = Omit<Relationship, 'to'> & {
    to: NoRelationshipsPerson
}

export type PersonCreationParams = Omit<Person, 'id'|'relationships'|'sex'|keyof Human|'ownedJurPersons'|'benOwnedJurPersons'> & {
    relationships: RelationshipCreationParams[],
    sex: Sex|null
} & HumanCreationParams

interface PersonCreationService extends CreationService<PreProcessedPerson> {

}

export default PersonCreationService;