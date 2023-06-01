import {
    BasicJurPersonExplorationParamsGroup,
    EntityExplorationData,
    EntityExplorationParams,
    EntityExplorationState,
    ExplorationMode
} from "./EntityExplorationState";
import {JurPerson} from "../../model/jurPerson/JurPerson";

class JurPersonExplorationState implements EntityExplorationState<JurPerson, JurPersonExplorationParams> {
    readonly data: EntityExplorationData<JurPerson>;
    readonly params: JurPersonExplorationParams;


    constructor(data: EntityExplorationData<JurPerson>, params: JurPersonExplorationParams) {
        this.data = data;
        this.params = params;
    }
}


export class JurPersonExplorationParams implements EntityExplorationParams, BasicJurPersonExplorationParamsGroup {
    readonly mode: ExplorationMode;
    readonly id: string | null = null;
    readonly name: string | null = null;


    constructor(mode: ExplorationMode, id?: string, name?: string) {
       this.mode = mode;
       if (id) {
           this.id = id;
       }
       if (name) {
           this.name = name;
       }
    }
}
