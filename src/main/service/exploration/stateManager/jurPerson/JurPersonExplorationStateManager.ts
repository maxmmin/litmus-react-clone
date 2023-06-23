import ExplorationStateManager from "../ExplorationStateManager";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import JurPersonExplorationState from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationState";
import JurPersonExplorationParams from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationParams";

export default interface JurPersonExplorationStateManager extends ExplorationStateManager<JurPerson, JurPersonExplorationParams> {}