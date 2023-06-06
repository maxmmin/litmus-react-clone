import {JurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonExplorationParams from "./JurPersonExplorationParams";
import EntityExplorationState from "../EntityExplorationState";
import EntityExplorationData from "../EntityExplorationData";

export default class JurPersonExplorationState implements EntityExplorationState<JurPerson, JurPersonExplorationParams> {
    readonly data: EntityExplorationData<JurPerson, JurPersonExplorationParams>;
    readonly params: JurPersonExplorationParams;


    constructor(data: EntityExplorationData<JurPerson, JurPersonExplorationParams>, params: JurPersonExplorationParams) {
        this.data = data;
        this.params = params;
    }
}


