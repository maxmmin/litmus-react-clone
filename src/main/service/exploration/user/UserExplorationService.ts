import ExplorationService from "../ExplorationService";
import {FullName} from "../FullName";
import Person from "../../../model/person/Person";
import User from "../../../model/user/User";

interface UserExplorationService extends ExplorationService<User> {
    findByFullName (fullName: FullName): User[]
}

export default UserExplorationService;