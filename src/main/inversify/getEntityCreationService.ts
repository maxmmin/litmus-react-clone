import {Entity} from "../model/Entity";
import CreationService from "../service/creation/CreationService";
import serviceContext from "../react/serviceContext";

const entityCreationServiceMap: Map<Entity, CreationService> = new Map<Entity, CreationService>();

entityCreationServiceMap.set(Entity.USER, serviceContext.creation.service.user);
entityCreationServiceMap.set(Entity.PERSON, serviceContext.creation.service.person);
entityCreationServiceMap.set(Entity.JUR_PERSON, serviceContext.creation.service.jurPerson);

export default function getEntityCreationService (entity: Entity): CreationService {
    const service: CreationService|undefined = entityCreationServiceMap.get(entity);
    if (!service) {
        throw new Error("unknown entity")
    }   else return service;
}