import {Entity} from "../model/Entity";
import CreationService from "../service/creation/CreationService";
import serviceContext from "../react/serviceContext";

const entityCreationServiceMap: Map<Entity, CreationService<unknown>> = new Map<Entity, CreationService<unknown>>();

entityCreationServiceMap.set(Entity.USER, serviceContext.creation.service.user);
entityCreationServiceMap.set(Entity.PERSON, serviceContext.creation.service.person);
entityCreationServiceMap.set(Entity.JUR_PERSON, serviceContext.creation.service.jurPerson);

export default function getEntityCreationService (entity: Entity): CreationService<unknown> {
    const service: CreationService<unknown>|undefined = entityCreationServiceMap.get(entity);
    if (!service) {
        throw new Error("unknown entityPageComponents")
    }   else return service;
}