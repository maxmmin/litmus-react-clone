import ExplorationMode, {basicHumanExplorationModes} from "../../ExplorationMode";
import BasicHumanExplorationParams from "../BasicHumanExplorationParams";
import HumanExplorationParams from "../HumanExplorationParams";

export default interface UserExplorationParams extends HumanExplorationParams {
    email: string|null
}

export class BasicUserExplorationParams extends BasicHumanExplorationParams implements UserExplorationParams {
    public static supportedModesIdList: number[] = Array.from([
        ...basicHumanExplorationModes
    ]).map(mode => mode.id);
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