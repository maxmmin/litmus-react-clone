import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import PersonCreationValidationService, {
    PersonValidationObject, RelationShipValidationObject,
    ServerPersonValidationObject
} from "./PersonCreationValidationService";
import Person from "../../../../model/human/person/Person";
import {ValidationErrors} from "../../../../model/ValidationErrors";
import Human from "../../../../model/human/Human";
import {DateEntityTool} from "../../../../model/DateEntity";
import {hasContent} from "../../../../util/functional/validation/isEmpty";
import hasHtml from "../../../../util/functional/validation/hasHtml";
import PassportData from "../../../../model/human/person/PassportData";
import valueOrNull from "../../../../util/functional/valueOrNull";
import {PersonCreationParams, RelationshipCreationParams} from "../../../coreServices/creation/PersonCreationService";
import {checkNotEmpty} from "../../../../util/pureFunctions";
import getArrayValidationKeyIndex from "../../../../util/functional/validation/getArrayValidationKeyIndex";
import extractImgErrorsFromServerObj from "../../../../util/functional/validation/extractImgErrorsFromServerObj";
import extractSourceErrorsFromServerObj from "../../../../util/functional/validation/extractSourceErrorsFromServerObj";

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
            relationships: relationShipsErrors,
            images: [],
            sources: []
        };
        return bindingResult;
    };

    hasErrors(bindingResult: PersonValidationObject): boolean {
        if (hasContent(bindingResult)) return true;

        return  bindingResult.relationships.some(relationshipValidationObject => hasContent(({...relationshipValidationObject, relationship: undefined} as Partial<RelationShipValidationObject>)))
    }

    validateRelationships(relationships: RelationshipCreationParams[]): RelationShipValidationObject[] {
        return relationships.map(this.validateRelationship).filter(v=>this.hasRelationshipVdObjectErrors(v));
    }

    validateRelationship(relationship: RelationshipCreationParams): RelationShipValidationObject {
        const bindingResult: RelationShipValidationObject = {relationship: relationship, type: null, note: null};
        if (relationship.note) {
            const noteTest = hasHtml(relationship.note);
            if (noteTest) {
                bindingResult.note = "Поле містить заборонені символи";
            }
        }

        if (!relationship.type) {
            bindingResult.type = "Вкажіть тип відносин";
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


    validateSex(sex: PersonCreationParams["sex"]): string|null {
        let sexErr = null;

        if (!sex) {
            sexErr = "Оберіть стать особи"
        }

        return sexErr;
    }

    hasRelationshipVdObjectErrors(validationObject: RelationShipValidationObject): boolean {
        return Boolean(validationObject.type||validationObject.note);
    }


    mapServerValidationErrors(model: PersonCreationParams, serverValidationObject: ServerPersonValidationObject): PersonValidationObject {
        const personValidationObject: PersonValidationObject = {
            firstName: valueOrNull(serverValidationObject.firstName),
            middleName: valueOrNull(serverValidationObject.middleName),
            lastName: valueOrNull(serverValidationObject.lastName),
            dateOfBirth: valueOrNull(serverValidationObject.dateOfBirth),
            sex: valueOrNull(serverValidationObject.sex),
            passportSerial: valueOrNull(serverValidationObject["passportData.passportSerial"]),
            passportNumber: valueOrNull(serverValidationObject["passportData.passportNumber"]),
            rnokppCode: valueOrNull(serverValidationObject["passportData.rnokppCode"]),
            location: valueOrNull(serverValidationObject["location"]),
            relationships: [],
            images: extractImgErrorsFromServerObj(model,serverValidationObject),
            sources: extractSourceErrorsFromServerObj(model, serverValidationObject)
        };

        const serverValidationKeys = Object.keys(serverValidationObject);

        const relationshipsErrors = serverValidationKeys.filter(r=>r.startsWith("relationships"));

        const requestRelationships = model.relationships;

        relationshipsErrors
            .forEach(key=>{
                const index = getArrayValidationKeyIndex(key);

                if (index) {
                    const message = serverValidationObject[key];
                    const field = key.substring(key.indexOf(".") + 1);

                    const relationship = checkNotEmpty(requestRelationships[index]);
                    const validationObject: RelationShipValidationObject = personValidationObject.relationships
                        .find(v=>v.relationship===relationship) || {
                        relationship: relationship,
                        type: null,
                        note: null
                    };

                    (validationObject as any)[field] = message;

                    personValidationObject.relationships.push(validationObject);
                }
            })

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