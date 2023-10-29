import ExplorationStateManagerImpl from "../ExplorationStateManagerImpl";
import {JurPerson, PreProcessedJurPerson} from "../../../../model/jurPerson/JurPerson";
import store from "../../../../redux/store";
import {ExplorationTypedAction} from "../../../../redux/actions/ExplorationTypedAction";
import JurPersonExplorationStateManager from "./JurPersonExplorationStateManager";
import JurPersonExplorationParams from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationParams";

class JurPersonExplorationStateManagerImpl extends ExplorationStateManagerImpl<PreProcessedJurPerson, JurPersonExplorationParams> implements JurPersonExplorationStateManager{
    constructor() {
        super(store.dispatch, ()=>store.getState().exploration.jurPerson!, ExplorationTypedAction.jurPerson);
    }
}

export default JurPersonExplorationStateManagerImpl;