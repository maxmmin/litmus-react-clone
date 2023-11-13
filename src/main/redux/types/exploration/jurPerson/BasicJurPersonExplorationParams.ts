import ExplorationMode from "../ExplorationMode";
import JurPersonExplorationParams from "./JurPersonExplorationParams";

export default class BasicJurPersonExplorationParams implements JurPersonExplorationParams {
    public static readonly supportedModesIdList: number[] = Array.from([ExplorationMode.BY_ID]).map(mode=>mode.id);

    public readonly supportedModesIdList: number[] = BasicJurPersonExplorationParams.supportedModesIdList;

    readonly modeId: number = this.supportedModesIdList[0];
    readonly i: number = 0;
    readonly id: string = "";
    readonly name: string = "";


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
