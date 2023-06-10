import User from "../../../../../model/human/user/User";
import HumanLookupService from "../HumanLookupService";

interface UserLookupService extends HumanLookupService<User> {
}

export default UserLookupService;