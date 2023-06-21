import ExplorationStateManagerImpl from "../ExplorationStateManagerImpl";
import User from "../../../../model/human/user/User";
import UserExplorationState from "../../../../redux/types/exploration/human/user/UserExplorationState";
import {ExplorationTypedAction} from "../../../../redux/actions/ExplorationTypedAction";
import store from "../../../../redux/store";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../../../inversify/IOC_TYPES";
import UserExplorationStateManager from "./UserExplorationStateManager";

@injectable()
class UserExplorationStateManagerImpl extends ExplorationStateManagerImpl<User,UserExplorationState> implements UserExplorationStateManager{

    constructor(@inject(IOC_TYPES.Store) _store: typeof store, @inject(IOC_TYPES.UserExplorationTypedAction) actions: ExplorationTypedAction) {
        super(_store.dispatch, ()=>_store.getState().exploration.user!, actions);
    }
}

export default UserExplorationStateManagerImpl;