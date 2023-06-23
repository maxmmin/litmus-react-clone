import {Entity} from "../model/Entity";
import ExplorationService from "../service/exploration/ExplorationService";
import EntityExplorationService from "../service/exploration/ExplorationService";
import container from "./inversify.config";
import UserExplorationService from "../service/exploration/UserExplorationService";
import IOC_TYPES from "./IOC_TYPES";
import PersonExplorationService from "../service/exploration/PersonExplorationService";
import JurPersonExplorationService from "../service/exploration/JurPersonExplorationService";
import CreationService from "../service/creation/CreationService";
import UserCreationService from "../service/creation/UserCreationService";
import PersonCreationService from "../service/creation/PersonCreationService";
import JurPersonCreationState from "../redux/types/creation/JurPersonCreationState";
import JurPersonCreationService from "../service/creation/JurPersonCreationService";

const entityCreationServiceMap: Map<Entity, CreationService> = new Map<Entity, CreationService>();

entityCreationServiceMap.set(Entity.USER, container.get<UserCreationService>(IOC_TYPES.creation.UserCreationService));
entityCreationServiceMap.set(Entity.PERSON, container.get<PersonCreationService>(IOC_TYPES.creation.PersonCreationService));
entityCreationServiceMap.set(Entity.JUR_PERSON, container.get<JurPersonCreationService>(IOC_TYPES.creation.JurPersonCreationService));

export default function getEntityCreationService (entity: Entity): CreationService {
    const service: CreationService|undefined = entityCreationServiceMap.get(entity);
    if (!service) {
        throw new Error("unknown entity")
    }   else return service;
}