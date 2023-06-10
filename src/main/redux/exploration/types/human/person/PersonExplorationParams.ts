import ExplorationMode from "../../ExplorationMode";
import BasicHumanExplorationParams from "../BasicHumanExplorationParams";

export default class PersonExplorationParams extends BasicHumanExplorationParams {
    public static supportedModesIdList: number[] = Array.from([ExplorationMode.BY_ID, ExplorationMode.BY_FULL_NAME]).map(mode => mode.id);
    public readonly supportedModesIdList: number[] = PersonExplorationParams.supportedModesIdList;
    readonly modeId: number = this.supportedModesIdList[0];

    constructor(mode?: ExplorationMode, i?: number, id?: string, firstName?: string, middleName?: string, lastName?: string) {
        super(i, id, firstName, middleName, lastName);
        if (mode) {
            this.modeId = mode.id;
        }
    }
}