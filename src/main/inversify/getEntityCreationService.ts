import {Entity} from "../model/Entity";
import CreationService from "../service/creation/CreationService";
import UserCreationService from "../service/creation/UserCreationService";
import PersonCreationService from "../service/creation/PersonCreationService";
import JurPersonCreationService from "../service/creation/JurPersonCreationService";

const entityCreationServiceMap: Map<Entity, CreationService> = new Map<Entity, CreationService>();

entityCreationServiceMap.set(Entity.USER, UserCreationService.getInstance());
entityCreationServiceMap.set(Entity.PERSON, PersonCreationService.getInstance());
entityCreationServiceMap.set(Entity.JUR_PERSON,JurPersonCreationService.getInstance());

export default function getEntityCreationService (entity: Entity): CreationService {
    const service: CreationService|undefined = entityCreationServiceMap.get(entity);
    if (!service) {
        throw new Error("unknown entity")
    }   else return service;
}