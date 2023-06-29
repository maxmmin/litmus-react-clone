import UserExplorationValidationService from "./UserExplorationValidationService";
import UserExplorationParams from "../../../../../redux/types/exploration/human/user/UserExplorationParams";
import HumanExplorationValidationServiceImpl from "../HumanExplorationValidationServiceImpl";
import {ValidationErrors} from "../../../../ValidationErrors";
import User from "../../../../../model/human/user/User";

class UserExplorationValidationServiceImpl extends HumanExplorationValidationServiceImpl implements UserExplorationValidationService {
    validate(params: UserExplorationParams): ValidationErrors<User> {
        const bindingResult: ValidationErrors<UserExplorationParams> = super.validate(params);
        return bindingResult;
    }

}

export default UserExplorationValidationServiceImpl;