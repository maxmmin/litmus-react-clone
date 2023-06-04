import UserExplorationService from "./UserExplorationService";
import {FullName} from "../FullName";
import User from "../../../model/user/User";
import ExplorationStateManager from "../../../redux/exploration/ExplorationStateManager";

class UserExplorationServiceImpl implements UserExplorationService {

    findByFullName(fullName: FullName): User[] {
    }

    findById(id: string): User {
        return void;
    }

    explore(): void {
    }


}

export default UserExplorationServiceImpl;