import Person from "../../../model/person/Person";
import {
    BasicHumanExplorationParamsGroup,
    EntityExplorationData,
    EntityExplorationParams,
    EntityExplorationState,
    ExplorationMode
} from "../EntityExplorationState";
import PersonExplorationParams from "./PersonExplorationParams";

export default class PersonExplorationState implements EntityExplorationState<Person, PersonExplorationParams>{
    readonly data: EntityExplorationData<Person>;
    readonly params: PersonExplorationParams;

    constructor(data: EntityExplorationData<Person>, params: PersonExplorationParams) {
        this.data = data;
        this.params = params;
    }
}

