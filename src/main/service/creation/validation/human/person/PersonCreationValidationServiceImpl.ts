import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import PersonCreationValidationService, {
    PersonValidationObject, RelationShipValidationObject,
    ServerPersonValidationObject
} from "./PersonCreationValidationService";
import Person, {Relationship} from "../../../../../model/human/person/Person";
import {ValidationErrors} from "../../../../ValidationErrors";
import Human from "../../../../../model/human/Human";
import {DateEntityTool} from "../../../../../model/DateEntity";
import {hasContent} from "../../../../../util/isEmpty";
import {hasErrors} from "../../../../exploration/validation/BasicExplorationValidationService";
import hasHtml from "../../../../../util/hasHtml";
import PassportData from "../../../../../model/human/person/PassportData";

class PersonCreationValidationServiceImpl extends HumanCreationValidationServiceImpl<Person, PersonValidationObject, ServerPersonValidationObject> implements PersonCreationValidationService {

    validate(params: Person): PersonValidationObject {
        let fullNameResult: ValidationErrors<Human> = super.validateFullName(params);
        const passportErrors = this.validatePassportData(params.passportData);
        const sexErr = this.validateSex(params.sex);
        const dateErr = this.validateDateOfBirth(params.dateOfBirth);
        const relationShipsErrors = this.validateRelationships(params.relationships)
        const bindingResult: PersonValidationObject = {...fullNameResult, ...passportErrors, sex: sexErr, dateOfBirth: dateErr, relationships: relationShipsErrors};
        return bindingResult;
    };

    hasErrors(bindingResult: PersonValidationObject): boolean {
        const main = {...bindingResult, relationships: undefined}
        if (hasErrors(main)) return true;

        return  bindingResult.relationships.some(relationshipValidationObject => hasErrors(({...relationshipValidationObject, relationship: undefined} as Partial<RelationShipValidationObject>)))
    }

    validateRelationships(relationships: Relationship[]): RelationShipValidationObject[] {
        return relationships.map(this.validateRelationship);
    }

    validateRelationship(relationship: Relationship): RelationShipValidationObject {
        const bindingResult: RelationShipValidationObject = {relationship: relationship};
        if (relationship) {
            if (relationship.note) {
                const noteTest = hasHtml(relationship.note);
                if (noteTest) {
                    bindingResult.note = "Поле містить заборонені символи";
                }

                if (!relationship.relationType) {
                    bindingResult.relationType = "Вкажіть тип відносин";
                }
            }
        }
        return bindingResult;
    }

    validateDateOfBirth(dateOfBirth: Person["dateOfBirth"]): PersonValidationObject["dateOfBirth"] {
        let dateErr: string|undefined = undefined;
        if (dateOfBirth&&hasContent(dateOfBirth)) {
            const date = DateEntityTool.isValid(dateOfBirth);
            if (!date) dateErr = "Введіть коректну дату"
        }
        return dateErr;
    }


    validateSex(sex: Person["sex"]): string|undefined {
        let sexErr = undefined;

        if (!sex) {
            sexErr = "Оберіть стать особи"
        }

        return sexErr;
    }

    mapServerValidationErrors(response: ServerPersonValidationObject): PersonValidationObject {
        const personValidationObject: PersonValidationObject = {...response, relationships: []};
        personValidationObject.passportSerial = response["passportData.passportSerial"];
        personValidationObject.passportNumber = response["passportData.passportNumber"];
        personValidationObject.rnokppCode = response["passportData.rnokppCode"];
        return personValidationObject;
    }

    validatePassportData(passportData: Person['passportData']): ValidationErrors<Person["passportData"]> {
        const bindingResult: Partial<PersonValidationObject> = {};

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