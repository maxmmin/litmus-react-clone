import User from "../../../model/user/User";
import UserExplorationParams from "./UserExplorationParams";
import EntityExplorationState from "../EntityExplorationState";
import EntityExplorationData from "../EntityExplorationData";

export default class UserExplorationState implements EntityExplorationState<User, UserExplorationParams> {
    readonly data: EntityExplorationData<User, UserExplorationParams>|null;
    isPending: boolean;
    readonly params: UserExplorationParams;

    constructor(params: UserExplorationParams, data: EntityExplorationData<User, UserExplorationParams>|null=null, isPending: boolean = false) {
        this.data = data;
        this.isPending = isPending;
        this.params = params;
    }
}
