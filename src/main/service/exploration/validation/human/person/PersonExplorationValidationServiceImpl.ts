import HumanExplorationValidationServiceImpl from "../HumanExplorationValidationServiceImpl";
import PersonExplorationValidationService from "./PersonExplorationValidationService";
import HumanExplorationParams from "../../../../../redux/types/exploration/human/HumanExplorationParams";
import PersonExplorationParams from "../../../../../redux/types/exploration/human/person/PersonExplorationParams";

class PersonExplorationValidationServiceImpl extends HumanExplorationValidationServiceImpl implements PersonExplorationValidationService {
    validate(params: HumanExplorationParams): Partial<Record<keyof PersonExplorationParams, string>> {
        const bindingResult: Partial<Record<keyof PersonExplorationParams, string>> = super.validate(params);
        return bindingResult;
    }
}

export default PersonExplorationValidationServiceImpl;