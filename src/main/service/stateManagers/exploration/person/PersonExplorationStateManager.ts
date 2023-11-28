import Person, {PreProcessedPerson} from "../../../../model/human/person/Person";
import PersonExplorationState from "../../../../redux/types/exploration/human/person/PersonExplorationState";
import HumanExplorationStateManager from "../HumanExplorationStateManager";
import PersonExplorationParams from "../../../../redux/types/exploration/human/person/PersonExplorationParams";

export default interface PersonExplorationStateManager extends HumanExplorationStateManager<PreProcessedPerson, PersonExplorationParams> {};