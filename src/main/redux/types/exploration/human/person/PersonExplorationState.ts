import Person from "../../../../../model/human/person/Person";
import PersonExplorationParams from "./PersonExplorationParams";
import EntityExplorationData from "../../EntityExplorationData";
import EntityExplorationState from "../../EntityExplorationState";

export default interface PersonExplorationState extends EntityExplorationState<Person, PersonExplorationParams> {}

export class BasicPersonExplorationState implements EntityExplorationState<Person, PersonExplorationParams>{
    readonly data: EntityExplorationData<Person, PersonExplorationParams>|null;
    readonly isPending: boolean;
    readonly params: PersonExplorationParams;

    constructor(params: PersonExplorationParams, data: EntityExplorationData<Person,PersonExplorationParams>|null = null, isPending: boolean = false) {
        this.data = data;
        this.isPending = isPending;
        this.params = params;
    }
}

