import CreationServiceImpl from "./CreationServiceImpl";
import PersonRequestDto from "../../rest/dto/person/PersonRequestDto";
import Person, {RawRelationshipsPerson, Relationship} from "../../model/human/person/Person";
import PersonResponseDto from "../../rest/dto/person/PersonResponseDto";
import PersonCreationApiService from "./api/PersonCreationApiService";
import PersonCreationStateManager from "./stateManager/person/PersonCreationStateManager";
import PersonCreationStateManagerImpl from "./stateManager/person/PersonCreationStateManagerImpl";
import PersonCreationValidationService, {
    PersonValidationObject, ServerPersonValidationObject
} from "./validation/human/person/PersonCreationValidationService";
import PersonCreationValidationServiceImpl from "./validation/human/person/PersonCreationValidationServiceImpl";
import FileRepoFactory from "../media/FileRepoFactory";
import getFilesFromMedia from "../../util/media/getFilesFromMedia";
import FileRepo from "../media/FileRepo";
import PersonDtoMapperImpl from "../../rest/dto/dtoMappers/PersonDtoMapperImpl";
import PersonDtoMapper from "../../rest/dto/dtoMappers/PersonDtoMapper";
import PersonCreationApiServiceImpl from "./api/PersonCreationApiServiceImpl";
import {NoRelationshipsPerson} from "../../redux/types/creation/PersonCreationState";
import Human, {HumanCreationParams} from "../../model/human/Human";
import CreationService from "./CreationService";

export type RelationshipCreationParams = Omit<Relationship, 'to'> & {
    to: NoRelationshipsPerson
}

export type PersonCreationParams = Omit<Person, 'id'|'relationships'|keyof Human> & {
    relationships: RelationshipCreationParams[]
} & HumanCreationParams

interface PersonCreationService extends CreationService<RawRelationshipsPerson> {

}

export default PersonCreationService;