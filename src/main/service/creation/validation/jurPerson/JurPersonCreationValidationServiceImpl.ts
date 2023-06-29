import JurPersonCreationValidationService from "./JurPersonCreationValidationService";
import JurPersonExplorationParams from "../../../../redux/types/exploration/jurPerson/JurPersonExplorationParams";
import {ValidationErrors} from "../../../ValidationErrors";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";

class JurPersonCreationValidationServiceImpl implements JurPersonCreationValidationService {
    validate(params: JurPersonExplorationParams): ValidationErrors<JurPerson> {
        const bindingResult: ValidationErrors<JurPerson> = {};
        return bindingResult;
    }
}

export default JurPersonCreationValidationServiceImpl;