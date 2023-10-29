import ExplorationStateManager from "../ExplorationStateManager";
import {JurPerson, PreProcessedJurPerson} from "../../../../model/jurPerson/JurPerson";
import JurPersonExplorationState from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationState";
import JurPersonExplorationParams from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationParams";

export default interface JurPersonExplorationStateManager extends ExplorationStateManager<PreProcessedJurPerson, JurPersonExplorationParams> {}