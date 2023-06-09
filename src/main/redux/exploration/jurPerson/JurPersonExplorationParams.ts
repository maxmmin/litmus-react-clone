import ExplorationMode from "../ExplorationMode";
import BasicJurPersonExplorationParamsGroup from "./BasicJurPersonExplorationParamsGroup";

export default class JurPersonExplorationParams implements BasicJurPersonExplorationParamsGroup {
    public static readonly supportedModesIdList: number[] = Array.from([ExplorationMode.BY_ID]).map(mode=>mode.id);

    public readonly supportedModesIdList: number[] = JurPersonExplorationParams.supportedModesIdList;

    readonly modeId: number = this.supportedModesIdList[0];
    readonly i: number = 0;
    readonly id: string | null = null;
    readonly name: string | null = null;


    constructor(mode?: ExplorationMode, i?: number, id?: string, name?: string) {
        if (mode) {
            this.modeId = mode.id;
        }
        if (i!==undefined&&!isNaN(Number(i))) {
            this.i = i!;
        }
        if (id) {
            this.id = id;
        }
        if (name) {
            this.name = name;
        }
    }

}
