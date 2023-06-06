import {JurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonExplorationParams from "./JurPersonExplorationParams";
import EntityExplorationState from "../EntityExplorationState";
import EntityExplorationData from "../EntityExplorationData";

export default class JurPersonExplorationState implements EntityExplorationState<JurPerson, JurPersonExplorationParams> {
    readonly data: EntityExplorationData<JurPerson, JurPersonExplorationParams>|null;
    isPending: boolean;
    readonly params: JurPersonExplorationParams;


    constructor(params: JurPersonExplorationParams, data: EntityExplorationData<JurPerson, JurPersonExplorationParams>|null=null, isPending: boolean = false) {
        this.data = data;
        this.isPending = isPending;
        this.params = params;
    }
}


