import {
    BasicJurPersonExplorationParamsGroup,
    EntityExplorationData,
    EntityExplorationParams,
    EntityExplorationState,
    ExplorationMode
} from "../EntityExplorationState";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonExplorationParams from "./JurPersonExplorationParams";

export default class JurPersonExplorationState implements EntityExplorationState<JurPerson, JurPersonExplorationParams> {
    readonly data: EntityExplorationData<JurPerson>;
    readonly params: JurPersonExplorationParams;


    constructor(data: EntityExplorationData<JurPerson>, params: JurPersonExplorationParams) {
        this.data = data;
        this.params = params;
    }
}


