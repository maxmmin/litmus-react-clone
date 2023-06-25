import ExplorationStateManagerImpl from "../ExplorationStateManagerImpl";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import BasicJurPersonExplorationState from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationState";

import IOC_TYPES from "../../../../inversify/IOC_TYPES";
import store from "../../../../redux/store";
import {ExplorationTypedAction} from "../../../../redux/actions/ExplorationTypedAction";
import JurPersonExplorationState from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationState";
import JurPersonExplorationStateManager from "./JurPersonExplorationStateManager";
import JurPersonExplorationParams from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationParams";

class JurPersonExplorationStateManagerImpl extends ExplorationStateManagerImpl<JurPerson, JurPersonExplorationParams> implements JurPersonExplorationStateManager{
    constructor() {
        super(store.dispatch, ()=>store.getState().exploration.jurPerson!, ExplorationTypedAction.jurPerson);
    }
}

export default JurPersonExplorationStateManagerImpl;