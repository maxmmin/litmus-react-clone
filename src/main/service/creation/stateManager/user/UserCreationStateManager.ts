import CreationStateManager from "../CreationStateManager";
import {UserCreationParams} from "../../../../redux/actions/CreationCoreActions";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";

interface UserCreationStateManager extends CreationStateManager<EntityCreationState<UserCreationParams>> {
}

export default UserCreationStateManager;