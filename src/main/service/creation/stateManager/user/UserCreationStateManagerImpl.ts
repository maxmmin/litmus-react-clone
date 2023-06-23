

import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import CreationStateManagerImpl from "../CreationStateManagerImpl";
import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedAction from "../../../../redux/actions/CreationTypedAction";
import UserCreationStateManager from "./UserCreationStateManager";
import User from "../../../../model/human/user/User";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../../../inversify/IOC_TYPES";

@injectable()
class UserCreationStateManagerImpl extends CreationStateManagerImpl<User,EntityCreationState<User>> implements UserCreationStateManager {

    constructor(@inject(IOC_TYPES.Store) private readonly _store: typeof store, @inject(IOC_TYPES.creation.typedActions.UserCreationTypedAction) private readonly _actions: CreationTypedAction) {
        const dispatch: AppDispatch = _store.dispatch;
        const getState = ()=>_store.getState().creation.user!;
        super(dispatch, getState, _actions);
    }



}

export default UserCreationStateManagerImpl;