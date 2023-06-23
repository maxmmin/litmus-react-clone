import ExplorationStateManagerImpl from "../ExplorationStateManagerImpl";
import Person from "../../../../model/human/person/Person";
import EntityExplorationState from "../../../../redux/types/exploration/EntityExplorationState";
import PersonExplorationState from "../../../../redux/types/exploration/human/person/PersonExplorationState";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../../../inversify/IOC_TYPES";
import store from "../../../../redux/store";
import {ExplorationTypedAction} from "../../../../redux/actions/ExplorationTypedAction";
import PersonExplorationStateManager from "./PersonExplorationStateManager";
import UserExplorationParams from "../../../../redux/types/exploration/human/user/UserExplorationParams";
import PersonExplorationParams from "../../../../redux/types/exploration/human/person/PersonExplorationParams";

@injectable()
class PersonExplorationStateManagerImpl extends ExplorationStateManagerImpl<Person, PersonExplorationParams> implements PersonExplorationStateManager {
    constructor(@inject(IOC_TYPES.Store) private readonly _store: typeof store, @inject(IOC_TYPES.exploration.typedActions.PersonExplorationTypedAction) private readonly _actions: ExplorationTypedAction) {
        super(_store.dispatch, ()=>_store.getState().exploration.person!, _actions);
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

export default PersonExplorationStateManagerImpl;