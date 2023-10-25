
import Person, {PreProcessedPerson, Relationship} from "../../model/human/person/Person";
import {NoRelationshipsPerson} from "../../redux/types/creation/PersonCreationState";
import Human, {HumanCreationParams} from "../../model/human/Human";
import CreationService from "./CreationService";

export type RelationshipCreationParams = Omit<Relationship, 'to'> & {
    to: NoRelationshipsPerson
}

export type PersonCreationParams = Omit<Person, 'id'|'relationships'|keyof Human> & {
    relationships: RelationshipCreationParams[]
} & HumanCreationParams

interface PersonCreationService extends CreationService<PreProcessedPerson> {

}

export default PersonCreationService;