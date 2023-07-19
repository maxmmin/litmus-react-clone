import CreationStateManager from "../CreationStateManager";
import User from "../../../../model/human/user/User";
import {UserValidationObject} from "../../validation/human/user/UserCreationValidationService";

interface UserCreationStateManager extends CreationStateManager<User, UserValidationObject> {
}

export default UserCreationStateManager;