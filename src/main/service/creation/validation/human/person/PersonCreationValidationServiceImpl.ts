import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import PersonCreationValidationService, {
    personDefaultValidationObject,
    PersonValidationObject, RelationShipValidationObject,
    ServerPersonValidationObject
} from "./PersonCreationValidationService";
import Person from "../../../../../model/human/person/Person";
import {ValidationErrors} from "../../../../ValidationErrors";
import Human from "../../../../../model/human/Human";
import {DateEntityTool} from "../../../../../model/DateEntity";
import {hasContent} from "../../../../../util/isEmpty";
import hasHtml from "../../../../../util/hasHtml";
import PassportData from "../../../../../model/human/person/PassportData";
import valueOrNull from "../../../../../util/valueOrNull";
import {PersonCreationParams, RelationshipCreationParams} from "../../../PersonCreationService";

class PersonCreationValidationServiceImpl extends HumanCreationValidationServiceImpl<PersonCreationParams, PersonValidationObject, ServerPersonValidationObject> implements PersonCreationValidationService {

        validate(params: PersonCreationParams): PersonValidationObject {
        let fullNameResult: ValidationErrors<Human> = super.validateFullName(params);
        const passportErrors = this.validatePassportData(params.passportData);
        const sexErr = this.validateSex(params.sex);
        const dateErr = this.validateDateOfBirth(params.dateOfBirth);
        const relationShipsErrors = this.validateRelationships(params.relationships)
        const bindingResult: PersonValidationObject = {
            ...fullNameResult,
            ...passportErrors,
            location: null,
            sex: sexErr,
            dateOfBirth: dateErr,
            relationships: relationShipsErrors
        };
        return bindingResult;
    };

    hasErrors(bindingResult: PersonValidationObject): boolean {
        const main = {...bindingResult, relationships: undefined}
        if (hasContent(main)) return true;

        return  bindingResult.relationships.some(relationshipValidationObject => hasContent(({...relationshipValidationObject, relationship: undefined} as Partial<RelationShipValidationObject>)))
    }

    validateRelationships(relationships: RelationshipCreationParams[]): RelationShipValidationObject[] {
        return relationships.map(this.validateRelationship);
    }

    validateRelationship(relationship: RelationshipCreationParams): RelationShipValidationObject {
        const bindingResult: RelationShipValidationObject = {relationship: relationship, relationType: null, note: null};
        if (relationship) {
            if (relationship.note) {
                const noteTest = hasHtml(relationship.note);
                if (noteTest) {
                    bindingResult.note = "Поле містить заборонені символи";
                }

                if (!relationship.type) {
                    bindingResult.relationType = "Вкажіть тип відносин";
                }
            }
        }
        return bindingResult;
    }

    validateDateOfBirth(dateOfBirth: Person["dateOfBirth"]): PersonValidationObject["dateOfBirth"] {
        let dateErr: string|null = null;

        if (dateOfBirth&&hasContent(dateOfBirth)) {
            const date = DateEntityTool.isValid(dateOfBirth);
            if (!date) dateErr = "Введіть коректну дату"
        }
        return dateErr;
    }


    validateSex(sex: Person["sex"]): string|null {
        let sexErr = null;

        if (!sex) {
            sexErr = "Оберіть стать особи"
        }

        return sexErr;
    }

    mapServerValidationErrors(response: ServerPersonValidationObject): PersonValidationObject {
        const personValidationObject: PersonValidationObject = {...personDefaultValidationObject};
        personValidationObject.firstName = valueOrNull(response.firstName);
        personValidationObject.middleName = valueOrNull(response.middleName);
        personValidationObject.lastName = valueOrNull(response.lastName);
        personValidationObject.dateOfBirth = valueOrNull(response.dateOfBirth);
        personValidationObject.sex = valueOrNull(response.sex);
        personValidationObject.passportSerial = valueOrNull(response["passportData.passportSerial"]);
        personValidationObject.passportNumber = valueOrNull(response["passportData.passportNumber"]);
        personValidationObject.rnokppCode = valueOrNull(response["passportData.rnokppCode"]);
        return personValidationObject;
    }

    validatePassportData(passportData: PersonCreationParams['passportData']): Pick<PersonValidationObject, keyof PassportData> {
        const bindingResult: Pick<PersonValidationObject, keyof PassportData> = {
            passportNumber: null,
            passportSerial: null,
            rnokppCode: null
        };

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