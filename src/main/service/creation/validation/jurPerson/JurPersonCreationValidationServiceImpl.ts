import JurPersonCreationValidationService, {
    JurPersonValidationObject,
    ServerJurPersonValidationObject
} from "./JurPersonCreationValidationService";
import {ValidationErrors} from "../../../ValidationErrors";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import {hasErrors} from "../../../exploration/validation/BasicExplorationValidationService";

class JurPersonCreationValidationServiceImpl implements JurPersonCreationValidationService {
    validate(model: JurPerson): ValidationErrors<JurPersonValidationObject> {
        const bindingResult: ValidationErrors<JurPerson> = {};
        return bindingResult;
    }

    mapServerValidationErrors(response: ValidationErrors<ServerJurPersonValidationObject>): ValidationErrors<JurPerson> {
        return {...response};
    }

    hasErrors(bindingResult: ValidationErrors<JurPersonValidationObject>): boolean {
        return hasErrors(bindingResult);
    }

}

export default JurPersonCreationValidationServiceImpl;