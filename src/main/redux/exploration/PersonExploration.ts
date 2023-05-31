import Person from "../../model/person/Person";
import {EntityExplorationData, EntityExplorationState, ExplorationMode} from "./explorationParams";

class PersonExplorationState implements EntityExplorationState<PersonExplorationParams>{
    // @TODO: maybe write smth like supported exploration modes
    private readonly _data: PersonExplorationData;
    private readonly _params: PersonExplorationParams;


    constructor(data: PersonExplorationData, params: PersonExplorationParams) {
        this._data = data;
        this._params = params;
    }


    get data(): PersonExplorationData {
        return this._data;
    }

    get params(): PersonExplorationParams {
        return this._params;
    }
}

class PersonExplorationParams {
    private readonly _mode: ExplorationMode = ExplorationMode.BY_FULL_NAME;
    private readonly _id: string | null = null;
    private readonly _firstName: string | null = null;
    private readonly _middleName: string | null = null;
    private readonly _lastName: string | null = null;

    constructor(id?: string, firstName?: string, middleName?: string, lastName?: string, mode?: ExplorationMode) {
        if (id) {
            this._id = id;
        }
        if (firstName) {
            this._firstName = firstName;
        }
        if (middleName) {
            this._middleName = middleName;
        }
        if (lastName) {
            this._lastName = lastName;
        }
        if (mode) {
            this._mode = mode;
        }
    }


    get mode(): ExplorationMode {
        return this._mode;
    }

    get id(): string | null {
        return this._id;
    }

    get firstName(): string | null {
        return this._firstName;
    }

    get middleName(): string | null {
        return this._middleName;
    }

    get lastName(): string | null {
        return this._lastName;
    }
}

class PersonExplorationData implements EntityExplorationData<Person>{
    private readonly _data: Array<Person> | null = null;

    constructor(persons?: Array<Person>) {
        if (persons) {
            this._data = persons;
        }
    }

    get(): Array<Person> | null {
        return this._data;
    }
}