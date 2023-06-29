import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import PersonCreationValidationService from "./PersonCreationValidationService";
import HumanExplorationParams from "../../../../../redux/types/exploration/human/HumanExplorationParams";
import PersonExplorationParams from "../../../../../redux/types/exploration/human/person/PersonExplorationParams";

class PersonCreationValidationServiceImpl extends HumanCreationValidationServiceImpl implements PersonCreationValidationService {
    validate(params: HumanExplorationParams): Partial<Record<keyof PersonExplorationParams, string>> {
        const bindingResult: Partial<Record<keyof PersonExplorationParams, string>> = super.validate(params);
        return bindingResult;
    }
}

export default PersonCreationValidationServiceImpl;