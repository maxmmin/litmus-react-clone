import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import {RoleName} from "../userIdentity/Role";
import {
    userDefaultValidationObject, UserValidationObject
} from "../../../service/creation/validation/human/user/UserCreationValidationService";
import {UserCreationParams} from "../../../service/creation/UserCreationService";

export default interface UserCreationState extends EntityCreationState<UserCreationParams, UserValidationObject> {

}

export const initialUserCreationParams: UserCreationParams = {
    email: "",
    firstName:  "",
    lastName: "",
    middleName: "",
    password: "",
    role: RoleName.USER,
    repeatPassword: ""
}


export class BasicUserCreationState extends BasicEntityCreationState<UserCreationParams, UserValidationObject> implements UserCreationState {

    constructor() {
        super(initialUserCreationParams, userDefaultValidationObject);
    }
}