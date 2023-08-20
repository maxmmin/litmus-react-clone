import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import User from "../../../model/human/user/User";
import {RoleName} from "../userIdentity/Role";
import {
    userDefaultValidationObject, UserValidationObject
} from "../../../service/creation/validation/human/user/UserCreationValidationService";

export default interface UserCreationState extends EntityCreationState<User, UserValidationObject> {

}

export const initialUserCreationParams: User = {
    id: '-1',
    email: "",
    firstName:  "",
    lastName: "",
    middleName: "",
    password: "",
    role: RoleName.USER
}


export class BasicUserCreationState extends BasicEntityCreationState<User, UserValidationObject> implements UserCreationState {

    constructor() {
        super(initialUserCreationParams, userDefaultValidationObject);
    }
}