import ExplorationValidationService from "../ExplorationValidationService";
import HumanExplorationParams from "../../../../redux/types/exploration/human/HumanExplorationParams";

export default interface HumanExplorationValidationService extends ExplorationValidationService<HumanExplorationParams> {
    validateFullName (params: HumanExplorationParams):  Partial<Record<keyof HumanExplorationParams, string>>|null;
}
