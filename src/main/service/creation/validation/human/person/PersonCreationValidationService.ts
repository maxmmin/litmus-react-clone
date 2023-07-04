import HumanCreationValidationService from "../HumanCreationValidationService";
import Person from "../../../../../model/human/person/Person";

export type PersonValidationErrors = Omit<Person, "passportData"|"dateOfBirth">&{passportSerial: string, passportNumber: string, rnokppCode: string}

export default interface PersonCreationValidationService extends HumanCreationValidationService<Person, PersonValidationErrors> {

}