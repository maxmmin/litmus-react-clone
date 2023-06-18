import CreationStateManager from "../CreationStateManager";
import {PersonCreationParams, UserCreationParams} from "../../../../redux/actions/CreationCoreActions";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import {PassportData} from "../../../../model/human/person/PassportData";

interface UserCreationStateManager extends CreationStateManager<EntityCreationState<UserCreationParams>> {
}

export default UserCreationStateManager;