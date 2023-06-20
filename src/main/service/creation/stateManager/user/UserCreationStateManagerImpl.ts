import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import CreationStateManagerImpl from "../CreationStateManagerImpl";
import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedAction from "../../../../redux/actions/CreationTypedAction";
import UserCreationStateManager from "./UserCreationStateManager";
import User from "../../../../model/human/user/User";

class UserCreationStateManagerImpl extends CreationStateManagerImpl<User,EntityCreationState<User>> implements UserCreationStateManager {

    constructor(_store: typeof store, actions: CreationTypedAction = CreationTypedAction.user) {
        const dispatch: AppDispatch = _store.dispatch;
        const getState = ()=>_store.getState().creation.user!;
        super(dispatch, getState, actions);
    }



}

export default UserCreationStateManagerImpl;