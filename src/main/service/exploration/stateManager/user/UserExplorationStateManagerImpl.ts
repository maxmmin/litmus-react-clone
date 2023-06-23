import ExplorationStateManagerImpl from "../ExplorationStateManagerImpl";
import User from "../../../../model/human/user/User";
import UserExplorationState from "../../../../redux/types/exploration/human/user/UserExplorationState";
import {ExplorationTypedAction} from "../../../../redux/actions/ExplorationTypedAction";
import store from "../../../../redux/store";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../../../inversify/IOC_TYPES";
import UserExplorationStateManager from "./UserExplorationStateManager";
import UserExplorationParams from "../../../../redux/types/exploration/human/user/UserExplorationParams";

@injectable()
class UserExplorationStateManagerImpl extends ExplorationStateManagerImpl<User,UserExplorationParams> implements UserExplorationStateManager{

    constructor(@inject(IOC_TYPES.Store) private readonly _store: typeof store, @inject(IOC_TYPES.exploration.typedActions.UserExplorationTypedAction) private readonly _actions: ExplorationTypedAction) {
        super(_store.dispatch, ()=>_store.getState().exploration.user!, _actions);
    }

    getFirstName(): UserExplorationParams["firstName"] {
        return this.getExplorationState().params.firstName;
    }

    getLastName(): UserExplorationParams["lastName"] {
        return this.getExplorationState().params.lastName;
    }

    getMiddleName(): UserExplorationParams["middleName"] {
        return this.getExplorationState().params.middleName;
    }


}

export default UserExplorationStateManagerImpl;