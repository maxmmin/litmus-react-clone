import ExplorationMode, {basicHumanExplorationModes} from "../../ExplorationMode";
import BasicHumanExplorationParams from "../BasicHumanExplorationParams";
import HumanExplorationParams from "../HumanExplorationParams";

export default interface UserExplorationParams extends HumanExplorationParams {
    email: string
}

export class BasicUserExplorationParams extends BasicHumanExplorationParams implements UserExplorationParams {
    public static supportedModesIdList: number[] = Array.from([
        ...basicHumanExplorationModes,
        ExplorationMode.BY_EMAIL
    ]).map(mode => mode.id);
    public readonly supportedModesIdList: number[] = BasicUserExplorationParams.supportedModesIdList;
    readonly modeId: number = this.supportedModesIdList[0];
    readonly email: string = "";

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