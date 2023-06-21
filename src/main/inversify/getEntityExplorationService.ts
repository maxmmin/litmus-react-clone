import {Entity} from "../model/Entity";
import ExplorationService from "../service/exploration/ExplorationService";
import EntityExplorationService from "../service/exploration/ExplorationService";
import container from "./inversify.config";
import UserExplorationService from "../service/exploration/UserExplorationService";
import IOC_TYPES from "./IOC_TYPES";
import PersonExplorationService from "../service/exploration/PersonExplorationService";
import JurPersonExplorationService from "../service/exploration/JurPersonExplorationService";

const entityExplorationMap: Map<Entity, ExplorationService> = new Map<Entity, EntityExplorationService>();

entityExplorationMap.set(Entity.USER, container.get<UserExplorationService>(IOC_TYPES.exploration.UserExplorationService));
entityExplorationMap.set(Entity.PERSON, container.get<PersonExplorationService>(IOC_TYPES.exploration.PersonExplorationService));
entityExplorationMap.set(Entity.JUR_PERSON, container.get<JurPersonExplorationService>(IOC_TYPES.exploration.JurPersonExplorationService));

export default function getEntityExplorationService(entity: Entity): ExplorationService {
    const explorationService = entityExplorationMap.get(entity);
    if (!explorationService) {
        throw new Error("unknown entity")
    } else return explorationService;
}