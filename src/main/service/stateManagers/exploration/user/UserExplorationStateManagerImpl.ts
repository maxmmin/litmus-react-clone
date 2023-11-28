import ExplorationStateManagerImpl from "../ExplorationStateManagerImpl";
import User from "../../../../model/human/user/User";
import {ExplorationTypedAction} from "../../../../redux/actions/ExplorationTypedAction";
import store from "../../../../redux/store";
import UserExplorationStateManager from "./UserExplorationStateManager";
import UserExplorationParams from "../../../../redux/types/exploration/human/user/UserExplorationParams";

class UserExplorationStateManagerImpl extends ExplorationStateManagerImpl<User,UserExplorationParams> implements UserExplorationStateManager{

    constructor() {
        super(store.dispatch, ()=>store.getState().exploration.user!,ExplorationTypedAction.user);
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