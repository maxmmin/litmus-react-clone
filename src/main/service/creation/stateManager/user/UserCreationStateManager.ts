import CreationStateManager from "../CreationStateManager";
import User from "../../../../model/human/user/User";
import {UserValidationObject} from "../../validation/human/user/UserCreationValidationService";
import {UserCreationParams} from "../../UserCreationService";

interface UserCreationStateManager extends CreationStateManager<User, UserCreationParams, UserValidationObject> {
}

export default UserCreationStateManager;