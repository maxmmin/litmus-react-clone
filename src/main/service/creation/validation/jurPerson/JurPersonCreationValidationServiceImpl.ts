import JurPersonCreationValidationService, {
    JurPersonValidationObject,
    ServerJurPersonValidationObject
} from "./JurPersonCreationValidationService";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import valueOrNull from "../../../../util/valueOrNull";
import {hasContent} from "../../../../util/isEmpty";
import {DateEntityTool} from "../../../../model/DateEntity";

class JurPersonCreationValidationServiceImpl implements JurPersonCreationValidationService {
    validate(model: JurPerson): JurPersonValidationObject {
        const bindingResult: JurPersonValidationObject = {
            dateOfRegistration: this.validateDateOfRegistration(model.dateOfRegistration),
            edrpou: this.validateEdrpou(model.edrpou),
            name: this.validateName(model.name)};
        return bindingResult;
    }

    validateName(name: JurPerson['name']): string | null {
        return hasContent(name)?null:"Ім'я не повинно бути пустим";
    }

    validateEdrpou(edrpou: JurPerson['edrpou']): string | null {
        if (!edrpou) return null;
        //@todo validation
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