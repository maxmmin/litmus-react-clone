import UserExplorationService from "./UserExplorationService";
import {FullName} from "../FullName";
import User from "../../../model/user/User";
import ExplorationStateManager from "../../../redux/exploration/ExplorationStateManager";

class UserExplorationServiceImpl implements UserExplorationService {
    private stateManager: ExplorationStateManager<any, any>

    constructor() {
    }

    findByFullName(fullName: FullName): Promise<User> {
    }

    findById(id: string): Promise<User> {
        return Promise.resolve(undefined);
    }

    explore(): void {
    }


}

export default UserExplorationServiceImpl;