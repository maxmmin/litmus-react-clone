import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import PersonCreationValidationService, {
    PersonValidationObject,
    ServerPersonValidationObject
} from "./PersonCreationValidationService";
import Person from "../../../../../model/human/person/Person";
import {ValidationErrors} from "../../../../ValidationErrors";
import Human from "../../../../../model/human/Human";
import DateEntity, {DateEntityTool} from "../../../../../model/DateEntity";
import {hasContent} from "../../../../../util/isEmpty";

class PersonCreationValidationServiceImpl extends HumanCreationValidationServiceImpl<Person, PersonValidationObject, ServerPersonValidationObject> implements PersonCreationValidationService {
    validate(params: Person): PersonValidationObject {
        let fullNameResult: ValidationErrors<Human> = super.validateFullName(params);
        const passportErrors = this.validatePassportData(params);
        const sexErr = this.validateSex(params);
        const dateErr = this.validateDateOfBirth(params);
        const bindingResult: PersonValidationObject = {...fullNameResult, ...passportErrors, ...sexErr, ...dateErr, relationships: []};
        return bindingResult;
    }

    validateDateOfBirth(model: Person): Partial<PersonValidationObject> {
        const dateOfBirth = model.dateOfBirth;
        const bindingResult: Partial<PersonValidationObject> = {}
        if (dateOfBirth&&hasContent(dateOfBirth)) {
            const date = DateEntityTool.isValid(dateOfBirth);
            if (!date) bindingResult.dateOfBirth = "Введіть коректну дату"
        }
        return bindingResult;
    }




    validateSex(model: Person): Partial<PersonValidationObject> {
        const personValidationObject: Partial<PersonValidationObject> = {};

        const sex = model.sex;
        if (!sex) {
            personValidationObject.sex = "Оберіть стать особи"
        }
        return personValidationObject;
    }



    mapServerValidationErrors(response: ServerPersonValidationObject): PersonValidationObject {
        const personValidationObject: PersonValidationObject = {...response, relationships: []};
        personValidationObject.passportSerial = response["passportData.passportSerial"];
        personValidationObject.passportNumber = response["passportData.passportNumber"];
        personValidationObject.rnokppCode = response["passportData.rnokppCode"];
        return personValidationObject;
    }

    validatePassportData(model: Person): Partial<PersonValidationObject> {
        const bindingResult: Partial<PersonValidationObject> = {};
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