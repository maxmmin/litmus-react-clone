import {UserIdentityState} from "../../redux/reducers/userIdentityReducer";
import User from "../human/user/User";
import Human, {FullName} from "../human/Human";

type UserIdentity = Pick<User, 'id'|'email'|keyof FullName|'role'>

export type UserIdentityStateReducible = UserIdentityState | undefined

export default UserIdentity;