import EntityExplorationParams from "../EntityExplorationParams";
import BasicHumanExplorationParamsGroup from "../BasicHumanExplorationParamsGroup";
import ExplorationMode from "../ExplorationMode";

export class UserExplorationParams implements EntityExplorationParams, BasicHumanExplorationParamsGroup{
    public static readonly supportedModes = Array.from([{...ExplorationMode.BY_ID}, {...ExplorationMode.BY_FULL_NAME}])

    public readonly supportedModes = UserExplorationParams.supportedModes;

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

export default UserExplorationParams;