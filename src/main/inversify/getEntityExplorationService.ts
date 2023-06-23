import {Entity} from "../model/Entity";
import ExplorationService from "../service/exploration/ExplorationService";
import EntityExplorationService from "../service/exploration/ExplorationService";
import container from "./inversify.config";
import UserExplorationService from "../service/exploration/UserExplorationService";
import IOC_TYPES from "./IOC_TYPES";
import PersonExplorationService from "../service/exploration/PersonExplorationService";
import JurPersonExplorationService from "../service/exploration/JurPersonExplorationService";
import ExplorationStateManager from "../service/exploration/stateManager/ExplorationStateManager";
import EntityExplorationParams from "../redux/types/exploration/EntityExplorationParams";
import JurPersonExplorationStateManager
    from "../service/exploration/stateManager/jurPerson/JurPersonExplorationStateManager";
import PersonExplorationStateManager from "../service/exploration/stateManager/person/PersonExplorationStateManager";
import UserExplorationStateManager from "../service/exploration/stateManager/user/UserExplorationStateManager";
const entityExplorationServiceMap: Map<Entity, ExplorationService> = new Map<Entity, EntityExplorationService>();

entityExplorationServiceMap.set(Entity.USER, container.get<UserExplorationService>(IOC_TYPES.exploration.UserExplorationService));
entityExplorationServiceMap.set(Entity.PERSON, container.get<PersonExplorationService>(IOC_TYPES.exploration.PersonExplorationService));
entityExplorationServiceMap.set(Entity.JUR_PERSON, container.get<JurPersonExplorationService>(IOC_TYPES.exploration.JurPersonExplorationService));

export default function getEntityExplorationService(entity: Entity): ExplorationService {
    const explorationService = entityExplorationServiceMap.get(entity);
    if (!explorationService) {
        throw new Error("unknown entity")
    } else return explorationService;
}

const entityExplorationStateManagerMap: Map<Entity, ExplorationStateManager<unknown, EntityExplorationParams>>
    = new Map<Entity, ExplorationStateManager<unknown, EntityExplorationParams>>();

entityExplorationStateManagerMap.set(Entity.PERSON, container.get<PersonExplorationStateManager>(IOC_TYPES.exploration.stateManagers.PersonExplorationStateManager))
entityExplorationStateManagerMap.set(Entity.JUR_PERSON, container.get<JurPersonExplorationStateManager>(IOC_TYPES.exploration.stateManagers.JurPersonExplorationStateManager));
entityExplorationStateManagerMap.set(Entity.USER, container.get<UserExplorationStateManager>(IOC_TYPES.exploration.stateManagers.UserExplorationStateManager));

export function getEntityExplorationStateManager(entity: Entity): ExplorationStateManager<unknown,EntityExplorationParams> {
    const manager:  ExplorationStateManager<unknown,EntityExplorationParams>|undefined =  entityExplorationStateManagerMap.get(entity)
    if (!manager) {
        throw new Error("unknown entity");
    } else {
        return manager;
    }
}