import JurPersonCreationValidationService, {
    JurPersonValidationObject,
    ServerJurPersonValidationObject
} from "./JurPersonCreationValidationService";
import {ValidationErrors} from "../../../ValidationErrors";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import {hasContent} from "../../../../util/isEmpty";

class JurPersonCreationValidationServiceImpl implements JurPersonCreationValidationService {
    validate(model: JurPerson): JurPersonValidationObject {
        const bindingResult: JurPersonValidationObject = {dateOfRegistration: null, edrpou: null, name: null};
        return bindingResult;
    }

    mapServerValidationErrors(response: ValidationErrors<ServerJurPersonValidationObject>): ValidationErrors<JurPerson> {
        return {...response};
    }

    hasErrors(bindingResult: JurPersonValidationObject): boolean {
        return bindingResult.name!==null||bindingResult.edrpou!==null||bindingResult.dateOfRegistration!==null;
    }

}

export default JurPersonCreationValidationServiceImpl;