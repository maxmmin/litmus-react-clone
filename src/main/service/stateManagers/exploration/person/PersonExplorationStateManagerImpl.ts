import ExplorationStateManagerImpl from "../ExplorationStateManagerImpl";
import Person, {PreProcessedPerson} from "../../../../model/human/person/Person";
import store from "../../../../redux/store";
import {ExplorationTypedAction} from "../../../../redux/actions/ExplorationTypedAction";
import PersonExplorationStateManager from "./PersonExplorationStateManager";
import UserExplorationParams from "../../../../redux/types/exploration/human/user/UserExplorationParams";
import PersonExplorationParams from "../../../../redux/types/exploration/human/person/PersonExplorationParams";

class PersonExplorationStateManagerImpl extends ExplorationStateManagerImpl<PreProcessedPerson, PersonExplorationParams> implements PersonExplorationStateManager {
    constructor() {
        super(store.dispatch, ()=>store.getState().exploration.person!,ExplorationTypedAction.person);
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