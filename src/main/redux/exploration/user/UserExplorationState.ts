import User from "../../../model/user/User";
import {
    BasicHumanExplorationParamsGroup,
    EntityExplorationData, EntityExplorationParams,
    EntityExplorationState,
    ExplorationMode
} from "../EntityExplorationState";
import UserExplorationParams from "./UserExplorationParams";

export default class UserExplorationState implements EntityExplorationState<User, UserExplorationParams> {
    readonly data: EntityExplorationData<User>;
    readonly params: UserExplorationParams;

    constructor(data: EntityExplorationData<User>, params: UserExplorationParams) {
        this.data = data;
        this.params = params;
    }
}
