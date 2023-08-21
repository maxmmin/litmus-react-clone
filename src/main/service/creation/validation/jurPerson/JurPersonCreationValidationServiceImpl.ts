import JurPersonCreationValidationService, {
    JurPersonValidationObject,
    ServerJurPersonValidationObject
} from "./JurPersonCreationValidationService";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import valueOrNull from "../../../../util/valueOrNull";

class JurPersonCreationValidationServiceImpl implements JurPersonCreationValidationService {
    validate(model: JurPerson): JurPersonValidationObject {
        const bindingResult: JurPersonValidationObject = {dateOfRegistration: null, edrpou: null, name: null};
        return bindingResult;
    }

    mapServerValidationErrors(response: ServerJurPersonValidationObject): JurPersonValidationObject {
        return {
            name: valueOrNull(response.name),
            edrpou: valueOrNull(response.edrpou),
            dateOfRegistration: valueOrNull(response.dateOfRegistration)
        };
    }

    hasErrors(bindingResult: JurPersonValidationObject): boolean {
        return bindingResult.name!==null||bindingResult.edrpou!==null||bindingResult.dateOfRegistration!==null;
    }

}

export default JurPersonCreationValidationServiceImpl;