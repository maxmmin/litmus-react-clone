import {
    BasicJurPersonExplorationParamsGroup,
    EntityExplorationData,
    EntityExplorationParams,
    EntityExplorationState,
    ExplorationMode
} from "./EntityExplorationState";
import {JurPerson} from "../../model/jurPerson/JurPerson";

export class JurPersonExplorationState implements EntityExplorationState<JurPerson, JurPersonExplorationParams> {
    readonly data: EntityExplorationData<JurPerson>;
    readonly params: JurPersonExplorationParams;


    constructor(data: EntityExplorationData<JurPerson>, params: JurPersonExplorationParams) {
        this.data = data;
        this.params = params;
    }
}


export class JurPersonExplorationParams implements EntityExplorationParams, BasicJurPersonExplorationParamsGroup {
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
