import ExplorationStateManager from "../ExplorationStateManager";
import {PreProcessedJurPerson} from "../../../../model/jurPerson/JurPerson";
import JurPersonExplorationParams from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationParams";

export default interface JurPersonExplorationStateManager extends ExplorationStateManager<PreProcessedJurPerson, JurPersonExplorationParams> {}