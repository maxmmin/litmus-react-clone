import JurPersonCreationValidationService from "./JurPersonCreationValidationService";
import {ValidationErrors} from "../../../ValidationErrors";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";

class JurPersonCreationValidationServiceImpl implements JurPersonCreationValidationService {
    validate(model: JurPerson): ValidationErrors<JurPerson> {
        const bindingResult: ValidationErrors<JurPerson> = {};
        return bindingResult;
    }
}

export default JurPersonCreationValidationServiceImpl;