import EntityService from "../EntityService";
import {FullName} from "../../exploration/FullName";
import Person from "../../../model/person/Person";
import User from "../../../model/user/User";

interface UserService extends EntityService<User> {
    findByFullName (fullName: FullName): Promise<User[]>
}

export default UserService;