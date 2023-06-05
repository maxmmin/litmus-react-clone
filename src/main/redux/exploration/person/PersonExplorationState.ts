import Person from "../../../model/person/Person";
import PersonExplorationParams from "./PersonExplorationParams";
import EntityExplorationData from "../EntityExplorationData";
import EntityExplorationState from "../EntityExplorationState";

export default class PersonExplorationState implements EntityExplorationState<Person, PersonExplorationParams>{
    readonly data: EntityExplorationData<Person>;
    readonly params: PersonExplorationParams;

    constructor(data: EntityExplorationData<Person>, params: PersonExplorationParams) {
        this.data = data;
        this.params = params;
    }
}

