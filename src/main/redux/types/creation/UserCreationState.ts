import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import User from "../../../model/human/user/User";

interface UserCreationState extends EntityCreationState<User> {

}

export class BasicUserCreationState extends BasicEntityCreationState<User> implements UserCreationState {

}