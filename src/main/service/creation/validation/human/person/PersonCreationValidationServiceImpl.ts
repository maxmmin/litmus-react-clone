import HumanCreationValidationServiceImpl from "../HumanCreationValidationServiceImpl";
import PersonCreationValidationService from "./PersonCreationValidationService";
import Person from "../../../../../model/human/person/Person";
import {ValidationErrors} from "../../../../ValidationErrors";
import Human from "../../../../../model/human/Human";

class PersonCreationValidationServiceImpl extends HumanCreationValidationServiceImpl implements PersonCreationValidationService {
    validate(params: Person): ValidationErrors<Person> {
        const bindingResult: ValidationErrors<Human> = super.validate(params);
        return bindingResult;
    }
}

export default PersonCreationValidationServiceImpl;