import ExplorationMode from "../../ExplorationMode";
import BasicHumanExplorationParams from "../BasicHumanExplorationParams";
import HumanExplorationParams from "../HumanExplorationParams";

interface UserExplorationParams extends HumanExplorationParams {
    email: string|null
}

class BasicUserExplorationParams extends BasicHumanExplorationParams implements UserExplorationParams {
    public static supportedModesIdList: number[] = Array.from([ExplorationMode.BY_ID, ExplorationMode.BY_FULL_NAME]).map(mode => mode.id);
    public readonly supportedModesIdList: number[] = BasicUserExplorationParams.supportedModesIdList;
    readonly modeId: number = this.supportedModesIdList[0];
    readonly email: string|null = null;

    constructor(mode?: ExplorationMode, i?: number, id?: string, firstName?: string, middleName?: string, lastName?: string, email?: string) {
        super(i, id, firstName, middleName, lastName);
        if (mode) {
            this.modeId = mode.id;
        }
        if (email) {
            this.email = email;
        }
    }
}

export default UserExplorationParams;