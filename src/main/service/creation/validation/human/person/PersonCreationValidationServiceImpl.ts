import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import PersonCreationValidationService, {PersonValidationErrors} from "./PersonCreationValidationService";
import Person from "../../../../../model/human/person/Person";
import {ValidationErrors} from "../../../../ValidationErrors";
import Human from "../../../../../model/human/Human";

class PersonCreationValidationServiceImpl extends HumanCreationValidationServiceImpl<Person, PersonValidationErrors> implements PersonCreationValidationService {
    validate(params: Person): ValidationErrors<PersonValidationErrors> {
        const bindingResult: ValidationErrors<Human> = super.validate(params);
        return bindingResult;
    }
}

export default PersonCreationValidationServiceImpl;