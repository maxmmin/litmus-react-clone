import ExplorationMode from "../ExplorationMode";
import BasicJurPersonExplorationParamsGroup from "./BasicJurPersonExplorationParamsGroup";

export default class JurPersonExplorationParams implements BasicJurPersonExplorationParamsGroup {
    public static readonly supportedModes: ExplorationMode[] = Array.from([ExplorationMode.BY_ID]);

    public readonly supportedModes: ExplorationMode[] = JurPersonExplorationParams.supportedModes;

    readonly mode: ExplorationMode = ExplorationMode.BY_ID;
    readonly i: number = 0;
    readonly id: string | null = null;
    readonly name: string | null = null;


    constructor(mode?: ExplorationMode, i?: number, id?: string, name?: string) {
        if (mode) {
            this.mode = mode;
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
