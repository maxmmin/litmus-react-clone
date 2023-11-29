import {UserIdentityState} from "../../redux/reducers/userIdentityReducer";
import User from "../human/user/User";

type UserIdentity = Omit<User, 'createdEntities'>


export type UserIdentityStateReducible = UserIdentityState | undefined

export default UserIdentity;