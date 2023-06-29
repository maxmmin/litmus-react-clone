import HumanExplorationValidationServiceImpl from "../HumanExplorationValidationServiceImpl";
import PersonExplorationValidationService from "./PersonExplorationValidationService";
import PersonExplorationParams from "../../../../../redux/types/exploration/human/person/PersonExplorationParams";
import {ValidationErrors} from "../../../../ValidationErrors";

class PersonExplorationValidationServiceImpl extends HumanExplorationValidationServiceImpl implements PersonExplorationValidationService {
    validate(params: PersonExplorationParams): ValidationErrors<PersonExplorationParams> {
        const bindingResult: Partial<Record<keyof PersonExplorationParams, string>> = super.validate(params);
        return bindingResult;
    }
}

export default PersonExplorationValidationServiceImpl;