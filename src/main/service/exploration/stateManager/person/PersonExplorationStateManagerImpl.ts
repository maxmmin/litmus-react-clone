import ExplorationStateManagerImpl from "../ExplorationStateManagerImpl";
import Person from "../../../../model/human/person/Person";
import EntityExplorationState from "../../../../redux/types/exploration/EntityExplorationState";
import PersonExplorationState from "../../../../redux/types/exploration/human/person/PersonExplorationState";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../../../inversify/IOC_TYPES";
import store from "../../../../redux/store";
import {ExplorationTypedAction} from "../../../../redux/actions/ExplorationTypedAction";
import PersonExplorationStateManager from "./PersonExplorationStateManager";

@injectable()
class PersonExplorationStateManagerImpl extends ExplorationStateManagerImpl<Person, PersonExplorationState> implements PersonExplorationStateManager {
    constructor(@inject(IOC_TYPES.Store) _store: typeof store, @inject(IOC_TYPES.PersonExplorationTypedAction) actions: ExplorationTypedAction) {
        super(_store.dispatch, ()=>_store.getState().exploration.person!, actions);
    }
}

export default PersonExplorationStateManagerImpl;