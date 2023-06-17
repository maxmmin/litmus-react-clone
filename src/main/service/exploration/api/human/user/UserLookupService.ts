import User from "../../../../../model/human/user/User";
import HumanExplorationApiService from "../HumanExplorationApiService";

interface UserLookupService extends HumanExplorationApiService<User> {
}

export default UserLookupService;