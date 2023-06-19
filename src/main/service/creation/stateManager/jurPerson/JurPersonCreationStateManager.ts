import CreationStateManager from "../CreationStateManager";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import {JurPersonCreationParams} from "../../../../redux/actions/CreationCoreActions";

interface JurPersonCreationStateManager extends CreationStateManager<EntityCreationState<JurPersonCreationParams>> {
}

export default JurPersonCreationStateManager;