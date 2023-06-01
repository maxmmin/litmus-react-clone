import Person from "../../model/person/Person";
import {
    BasicHumanExplorationParamsGroup,
    EntityExplorationData,
    EntityExplorationParams,
    EntityExplorationState,
    ExplorationMode
} from "./EntityExplorationState";

export class PersonExplorationState implements EntityExplorationState<Person, PersonExplorationParams>{
    // @TODO: maybe write smth like supported exploration modes
    readonly data: EntityExplorationData<Person>;
    readonly params: PersonExplorationParams;

    constructor(data: EntityExplorationData<Person>, params: PersonExplorationParams) {
        this.data = data;
        this.params = params;
    }
}

export class PersonExplorationParams implements EntityExplorationParams, BasicHumanExplorationParamsGroup{
    readonly mode: ExplorationMode = ExplorationMode.BY_FULL_NAME;
    readonly id: string | null = null;
    readonly firstName: string | null = null;
    readonly middleName: string | null = null;
    readonly lastName: string | null = null;


    constructor(mode?: ExplorationMode, id?: string, firstName?: string, middleName?: string, lastName?: string) {
        if (mode) {
            this.mode = mode;
        }
        if (id) {
            this.id = id;
        }
        if (firstName) {
            this.firstName=firstName;
        }
        if (middleName) {
            this.middleName=middleName;
        }
        if (lastName) {
            this.lastName=lastName;
        }
    }
}