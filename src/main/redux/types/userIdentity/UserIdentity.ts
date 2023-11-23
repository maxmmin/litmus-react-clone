import {UserIdentityState} from "../../reducers/userIdentityReducer";
import User from "../../../model/human/user/User";

type UserIdentity = Omit<User, 'createdEntities'>


export type UserIdentityStateReducible = UserIdentityState | undefined

export default UserIdentity;