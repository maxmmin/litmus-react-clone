import {UserIdentityState} from "../../reducers/userIdentityReducer";
import User from "../../../model/human/user/User";

type UserIdentity = User


export type UserIdentityStateReducible = UserIdentityState | undefined

export default UserIdentity;