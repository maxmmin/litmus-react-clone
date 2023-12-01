import JurPersonCreationValidationService, {
    JurPersonValidationObject,
    ServerJurPersonValidationObject
} from "./JurPersonCreationValidationService";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import valueOrNull from "../../../util/functional/valueOrNull";
import {hasContent} from "../../../util/functional/isEmpty";
import {DateEntityTool} from "../../../model/DateEntity";
import {JurPersonCreationParams} from "../../../redux/types/creation/JurPersonCreationState";

class JurPersonCreationValidationServiceImpl implements JurPersonCreationValidationService {
    validate(model: JurPersonCreationParams): JurPersonValidationObject {
        const bindingResult: JurPersonValidationObject = {
            dateOfRegistration: this.validateDateOfRegistration(model.dateOfRegistration),
            edrpou: this.validateEdrpou(model.edrpou),
            name: this.validateName(model.name)};
        return bindingResult;
    }

    validateName(name: JurPersonCreationParams['name']): string | null {
        return hasContent(name)?null:"Ім'я не повинно бути пустим";
    }

    validateEdrpou(edrpou: JurPersonCreationParams['edrpou']): string | null {
        if (!edrpou) return null;
        //@todo creation
        return null;
    }



    validateDateOfRegistration(dateOfRegistration: JurPerson["dateOfRegistration"]): string|null {
        let dateErr: string|null = null;

        if (dateOfRegistration&&hasContent(dateOfRegistration)) {
            const date = DateEntityTool.isValid(dateOfRegistration);
            if (!date) dateErr = "Введіть коректну дату"
        }
        return dateErr;
    }

    mapServerValidationErrors(model: JurPersonCreationParams, response: ServerJurPersonValidationObject): JurPersonValidationObject {
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