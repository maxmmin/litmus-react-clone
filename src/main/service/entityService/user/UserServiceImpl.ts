import UserService from "./UserService";
import {FullName} from "../../exploration/FullName";
import User from "../../../model/user/User";
import ExplorationStateManager from "../../../redux/exploration/ExplorationStateManager";

class UserServiceImpl implements UserService {

    findByFullName(fullName: FullName): User[] {
    }

    findById(id: string): User {
        return void;
    }

    explore(): void {
    }


}

export default UserServiceImpl;