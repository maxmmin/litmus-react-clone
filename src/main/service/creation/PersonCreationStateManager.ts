import CreationStateManager from "./CreationStateManager";
import {PersonCreationParams} from "../../redux/creation/CreationCoreActions";
import EntityCreationState from "../../redux/creation/EntityCreationState";

interface PersonCreationStateManager extends CreationStateManager<EntityCreationState<PersonCreationParams>> {
    updatePassportData: void;
}

export default PersonCreationStateManager;