import ExplorationStateManager from "../ExplorationStateManager";
import Person from "../../../../model/human/person/Person";
import PersonExplorationState from "../../../../redux/types/exploration/human/person/PersonExplorationState";

export default interface PersonExplorationStateManager extends ExplorationStateManager<Person, PersonExplorationState> {};