import User from "../../../model/human/user/User";
import HumanService from "../human/HumanService";

interface UserService extends HumanService<User> {
}

export default UserService;