import User from "../../../model/user/User";
import UserExplorationParams from "./UserExplorationParams";
import EntityExplorationState from "../EntityExplorationState";
import EntityExplorationData from "../EntityExplorationData";

export default class UserExplorationState implements EntityExplorationState<User, UserExplorationParams> {
    readonly data: EntityExplorationData<User>;
    readonly params: UserExplorationParams;

    constructor(data: EntityExplorationData<User>, params: UserExplorationParams) {
        this.data = data;
        this.params = params;
    }
}
