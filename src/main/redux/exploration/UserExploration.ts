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
    public readonly supportedModes = Array.from([ExplorationMode.BY_ID, ExplorationMode.BY_FULL_NAME])

    readonly mode: ExplorationMode = ExplorationMode.BY_FULL_NAME;
    readonly id: string | null = null;
    readonly firstName: string | null = null;
    readonly middleName: string | null = null;
    readonly lastName: string | null = null;


    constructor(mode?: ExplorationMode, id?: string, firstName?: string, middleName?: string, lastName?: string) {
        if (mode) {
            this.mode = mode;
        }
        // this.checkModeSupport(this.mode);
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

    // private isModeSupported(mode: ExplorationMode): boolean {
    //     return UserExplorationParams.supportedMods.includes(mode);
    // } @TODO: write this when i be able to check serialization feature
    //
    // private checkModeSupport(mode: ExplorationMode): void {
    //     if (!this.isModeSupported(mode)) {
    //         throw new Error("unsupported mode");
    //     }
    // }
}