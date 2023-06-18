import {
    UserCreationParams
} from "../../../../redux/actions/CreationCoreActions";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import CreationStateManagerImpl from "../CreationStateManagerImpl";
import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedActions from "../../../../redux/actions/CreationTypedActions";
import UserCreationStateManager from "./UserCreationStateManager";

class UserCreationStateManagerImpl extends CreationStateManagerImpl<EntityCreationState<UserCreationParams>> implements UserCreationStateManager {

    constructor(_store: typeof store = store, actions: CreationTypedActions = CreationTypedActions.user) {
        const dispatch: AppDispatch = _store.dispatch;
        const getState = ()=>_store.getState().creation.user!;
        super(dispatch, getState, actions);
    }



}

export default UserCreationStateManagerImpl;