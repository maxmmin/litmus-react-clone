import CreationStateManager from "../CreationStateManager";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import User from "../../../../model/human/user/User";

interface UserCreationStateManager extends CreationStateManager<User, EntityCreationState<User>> {
}

export default UserCreationStateManager;