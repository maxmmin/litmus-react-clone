import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import User from "../../../model/human/user/User";
import {RoleName} from "../userIdentity/Role";

export default interface UserCreationState extends EntityCreationState<User> {

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


export class BasicUserCreationState extends BasicEntityCreationState<User> implements UserCreationState {

    constructor() {
        super(initialUserCreationParams, {});
    }
}