import {Entity} from "../../model/Entity";

interface CreationService {
    create (entity: Entity): void;
}

export default CreationService;