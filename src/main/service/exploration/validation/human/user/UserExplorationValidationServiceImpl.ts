import UserExplorationValidationService from "./UserExplorationValidationService";
import UserExplorationParams from "../../../../../redux/types/exploration/human/user/UserExplorationParams";
import HumanExplorationValidationServiceImpl from "../HumanExplorationValidationServiceImpl";

class UserExplorationValidationServiceImpl extends HumanExplorationValidationServiceImpl implements UserExplorationValidationService {
    validate(params: UserExplorationParams): Partial<Record<keyof UserExplorationParams, string>> {
        const bindingResult: Partial<Record<keyof UserExplorationParams, string>> = super.validate(params);
        return bindingResult;
    }

}

export default UserExplorationValidationServiceImpl;