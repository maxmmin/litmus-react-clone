import User from "../../../../../model/human/user/User";
import HumanExplorationApiService from "../HumanExplorationApiService";

interface UserExplorationApiService extends HumanExplorationApiService<User> {
}

export default UserExplorationApiService;