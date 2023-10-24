import {Entity} from "../model/Entity";
import ExplorationService from "../service/exploration/ExplorationService";
import EntityExplorationService from "../service/exploration/ExplorationService";
import ExplorationStateManager from "../service/exploration/stateManager/ExplorationStateManager";
import EntityExplorationParams from "../redux/types/exploration/EntityExplorationParams";
import serviceContext from "../react/serviceContext";
const entityExplorationServiceMap: Map<Entity, ExplorationService> = new Map<Entity, EntityExplorationService>();

entityExplorationServiceMap.set(Entity.USER, serviceContext.exploration.service.user);
entityExplorationServiceMap.set(Entity.PERSON, serviceContext.exploration.service.person);
entityExplorationServiceMap.set(Entity.JUR_PERSON, serviceContext.exploration.service.jurPerson);

export default function getEntityExplorationService(entity: Entity): ExplorationService {
    const explorationService = entityExplorationServiceMap.get(entity);
    if (!explorationService) {
        throw new Error("unknown entityPageComponents")
    } else return explorationService;
}

const entityExplorationStateManagerMap: Map<Entity, ExplorationStateManager<unknown, EntityExplorationParams>>
    = new Map<Entity, ExplorationStateManager<unknown, EntityExplorationParams>>();

entityExplorationStateManagerMap.set(Entity.PERSON, serviceContext.exploration.stateManagers.person);
entityExplorationStateManagerMap.set(Entity.JUR_PERSON, serviceContext.exploration.stateManagers.jurPerson);
entityExplorationStateManagerMap.set(Entity.USER, serviceContext.exploration.stateManagers.user);

export function getEntityExplorationStateManager(entity: Entity): ExplorationStateManager<unknown,EntityExplorationParams> {
    const manager:  ExplorationStateManager<unknown,EntityExplorationParams>|undefined =  entityExplorationStateManagerMap.get(entity)
    if (!manager) {
        throw new Error("unknown entityPageComponents");
    } else {
        return manager;
    }
}