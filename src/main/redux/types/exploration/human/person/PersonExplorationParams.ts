import ExplorationMode, {basicHumanExplorationModes} from "../../ExplorationMode";
import BasicHumanExplorationParams from "../BasicHumanExplorationParams";
import HumanExplorationParams from "../HumanExplorationParams";
import basicHumanExplorationParams from "../BasicHumanExplorationParams";

interface PersonExplorationParams extends HumanExplorationParams {}

export class BasicPersonExplorationParams extends BasicHumanExplorationParams {
    public static supportedModesIdList: number[] = Array.from([
        ...basicHumanExplorationModes
    ]).map(mode => mode.id);
    public readonly supportedModesIdList: number[] = BasicPersonExplorationParams.supportedModesIdList;
    readonly modeId: number = this.supportedModesIdList[0];

    constructor(mode?: ExplorationMode, i?: number, id?: string, firstName?: string, middleName?: string, lastName?: string) {
        super(i, id, firstName, middleName, lastName);
        if (mode) {
            this.modeId = mode.id;
        }
    }
}

export default PersonExplorationParams;