import CreationStateManagerImpl from "../CreationStateManagerImpl";
import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedAction from "../../../../redux/actions/CreationTypedAction";
import UserCreationStateManager from "./UserCreationStateManager";
import User from "../../../../model/human/user/User";


class UserCreationStateManagerImpl extends CreationStateManagerImpl<User> implements UserCreationStateManager {

    constructor() {
        const dispatch: AppDispatch = store.dispatch;
        const getState = ()=>store.getState().creation.user!;
        super(dispatch, getState, CreationTypedAction.user);
    }



}

export default UserCreationStateManagerImpl;