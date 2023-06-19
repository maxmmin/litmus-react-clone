import store from "../../../redux/store";
import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import {
    JurPersonCreationParams,
    UserCreationParams
} from "../../../redux/actions/CreationCoreActions";
import CreationTypedAction from "../../../redux/actions/CreationTypedActions";
import {Entity} from "../../../model/Entity";
import CreationStateManagerImpl from "./CreationStateManagerImpl";
import PersonCreationStateManager from "./person/PersonCreationStateManager";
import PersonCreationStateManagerImpl from "./person/PersonCreationStateManagerImpl";
import UserCreationStateManagerImpl from "./user/UserCreationStateManagerImpl";
import JurPersonCreationStateManagerImpl from "./jurPerson/JurPersonCreationStateManagerImpl";
import UserCreationStateManager from "./user/UserCreationStateManager";
import JurPersonCreationStateManager from "./jurPerson/JurPersonCreationStateManager";

class CreationStateManagerFactory {
    static getJurPersonManager (providedStore: typeof store): JurPersonCreationStateManager {
        return new JurPersonCreationStateManagerImpl(providedStore);
    }

    static getPersonManager (providedStore: typeof store): PersonCreationStateManager {
        return new PersonCreationStateManagerImpl(providedStore);
    }

    static getUserManager (providedStore: typeof store): UserCreationStateManager {
        return new UserCreationStateManagerImpl(providedStore);
    }

    static getEntityManager(entity: Entity, providedStore: typeof store): CreationStateManagerImpl<EntityCreationState<unknown>> {
        switch (entity) {
            case Entity.PERSON: {
                return new PersonCreationStateManagerImpl(providedStore);
            }

            case Entity.JUR_PERSON: {
                return new JurPersonCreationStateManagerImpl(providedStore);
            }

            case Entity.USER: {
                return new UserCreationStateManagerImpl(providedStore);
            }

            default: throw new Error("unsupported entity");
        }
    }
}

export default CreationStateManagerFactory;