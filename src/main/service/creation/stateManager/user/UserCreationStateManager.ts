import CreationStateManager from "../CreationStateManager";
import {PersonCreationParams, UserCreationParams} from "../../../../redux/creation/CreationCoreActions";
import EntityCreationState from "../../../../redux/creation/EntityCreationState";
import {PassportData} from "../../../../model/human/person/PassportData";

interface UserCreationStateManager extends CreationStateManager<EntityCreationState<UserCreationParams>> {
}

export default UserCreationStateManager;