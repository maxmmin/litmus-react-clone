import ExplorationStateManager from "../ExplorationStateManager";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import JurPersonExplorationState from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationState";

export default interface JurPersonExplorationStateManager extends ExplorationStateManager<JurPerson, JurPersonExplorationState> {}