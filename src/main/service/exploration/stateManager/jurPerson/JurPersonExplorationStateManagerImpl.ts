import ExplorationStateManagerImpl from "../ExplorationStateManagerImpl";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import BasicJurPersonExplorationState from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationState";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../../../inversify/IOC_TYPES";
import store from "../../../../redux/store";
import {ExplorationTypedAction} from "../../../../redux/actions/ExplorationTypedAction";
import JurPersonExplorationState from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationState";
import JurPersonExplorationStateManager from "./JurPersonExplorationStateManager";
import JurPersonExplorationParams from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationParams";

@injectable()
class JurPersonExplorationStateManagerImpl extends ExplorationStateManagerImpl<JurPerson, JurPersonExplorationParams> implements JurPersonExplorationStateManager{
    constructor(@inject(IOC_TYPES.Store) _store: typeof store, @inject(IOC_TYPES.exploration.typedActions.JurPersonExplorationTypedAction) actions: ExplorationTypedAction) {
        super(_store.dispatch, ()=>_store.getState().exploration.jurPerson!, actions);
    }
}

export default JurPersonExplorationStateManagerImpl;