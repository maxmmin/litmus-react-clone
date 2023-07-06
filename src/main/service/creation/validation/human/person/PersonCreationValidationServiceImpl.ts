import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import PersonCreationValidationService, {PersonValidationObject} from "./PersonCreationValidationService";
import Person from "../../../../../model/human/person/Person";
import {ValidationErrors} from "../../../../ValidationErrors";
import Human from "../../../../../model/human/Human";

class PersonCreationValidationServiceImpl extends HumanCreationValidationServiceImpl<Person, PersonValidationObject> implements PersonCreationValidationService {
    validate(params: Person): ValidationErrors<PersonValidationObject> {
        let bindingResult: ValidationErrors<Human> = super.validate(params);
        const passportErrors = this.validatePassportData(params);
        bindingResult = {...bindingResult, ...passportErrors};
        return bindingResult;
    }

    validatePassportData(model: Person): ValidationErrors<PersonValidationObject> {
        const bindingResult: ValidationErrors<PersonValidationObject> = {};
        const passportData = model.passportData;

        if (passportData) {
            const passportSerial = passportData.passportSerial;
            if (passportSerial) {
                const symbolError = passportSerial.split("").some(digit=>isNaN(+digit))
                if (symbolError) {
                    bindingResult.passportSerial = "Серія паспорту повинна складатися лише з цифр"
                } else {
                    if (passportSerial.length>32) {
                        bindingResult.passportSerial = "Серія паспорту повинна бути менше 32"
                    }
                }
            }

            const passportNumber = passportData.passportNumber;
            if (passportNumber) {
                const symbolError = passportNumber.split("").some(digit=>isNaN(+digit))
                if (symbolError) {
                    bindingResult.passportNumber = "Номер паспорту повинен складатися лише з цифр"
                } else {
                    if (passportNumber.length>32) {
                        bindingResult.passportNumber = "Номер паспорту повинен бути менше 32"
                    }
                }
            }

            const rnokpp = passportData.rnokppCode;
            if (rnokpp) {
                const symbolError = rnokpp.split("").some(digit=>isNaN(+digit))
                if (symbolError) {
                    bindingResult.rnokppCode = "РНОКПП повинен складатися лише з цифр"
                } else {
                    if (rnokpp.length>32) {
                        bindingResult.rnokppCode = "РНОКПП повинен бути менше 32"
                    }
                }
            }
        }

        return bindingResult;
    }


}

export default PersonCreationValidationServiceImpl;