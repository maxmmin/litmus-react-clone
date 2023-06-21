import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import BasicJurPersonExplorationParams from "./BasicJurPersonExplorationParams";
import EntityExplorationState from "../EntityExplorationState";
import EntityExplorationData from "../EntityExplorationData";

export default interface JurPersonExplorationState extends EntityExplorationState<JurPerson, BasicJurPersonExplorationParams> {};

export class JurPersonExplorationState implements JurPersonExplorationState {
    readonly data: EntityExplorationData<JurPerson, BasicJurPersonExplorationParams>|null;
    isPending: boolean;
    readonly params: BasicJurPersonExplorationParams;

    constructor(params: BasicJurPersonExplorationParams, data: EntityExplorationData<JurPerson, BasicJurPersonExplorationParams>|null=null, isPending: boolean = false) {
        this.data = data;
        this.isPending = isPending;
        this.params = params;
    }
}


