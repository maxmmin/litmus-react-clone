import ExplorationValidationService from "../ExplorationValidationService";
import HumanExplorationParams from "../../../../redux/types/exploration/human/HumanExplorationParams";
import {ValidationErrors} from "../../../ValidationErrors";

export default interface HumanExplorationValidationService extends ExplorationValidationService<HumanExplorationParams> {
    validateFullName (params: HumanExplorationParams):  ValidationErrors<HumanExplorationParams>|null;
}
