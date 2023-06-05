import EntityExplorationParams from "../EntityExplorationParams";
import ExplorationMode from "../ExplorationMode";
import BasicJurPersonExplorationParamsGroup from "./BasicJurPersonExplorationParamsGroup";

export default class JurPersonExplorationParams implements EntityExplorationParams, BasicJurPersonExplorationParamsGroup {
    public static readonly supportedModes: ExplorationMode[] = Array.from([{...ExplorationMode.BY_ID}]);

    public readonly supportedModes: ExplorationMode[] = JurPersonExplorationParams.supportedModes;

    readonly mode: ExplorationMode = ExplorationMode.BY_ID;
    readonly id: string | null = null;
    readonly name: string | null = null;


    constructor(mode?: ExplorationMode, id?: string, name?: string) {
        if (mode) {
            this.mode = mode;
        }
        if (id) {
            this.id = id;
        }
        if (name) {
            this.name = name;
        }
    }

}
