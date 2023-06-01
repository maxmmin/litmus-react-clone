import User from "../../model/user/User";
import {
    BasicHumanExplorationParamsGroup,
    EntityExplorationData, EntityExplorationParams,
    EntityExplorationState,
    ExplorationMode
} from "./EntityExplorationState";

export class UserExplorationState implements EntityExplorationState<User, UserExplorationParams> {
    readonly data: EntityExplorationData<User>;
    readonly params: UserExplorationParams;

    constructor(data: EntityExplorationData<User>, params: UserExplorationParams) {
        this.data = data;
        this.params = params;
    }
}

export class UserExplorationParams implements EntityExplorationParams, BasicHumanExplorationParamsGroup{
    readonly mode: ExplorationMode;
    readonly id: string | null = null;
    readonly firstName: string | null = null;
    readonly middleName: string | null = null;
    readonly lastName: string | null = null;


    constructor(mod: ExplorationMode, id?: string, firstName?: string, middleName?: string, lastName?: string) {
        this.mode = mod;
        if (id) {
            this.id = id;
        }
        if (firstName) {
            this.firstName=firstName;
        }
        if (middleName) {
            this.middleName=middleName;
        }
        if (lastName) {
            this.lastName=lastName;
        }
    }

}