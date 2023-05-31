import {EntityExplorationData, EntityExplorationState, ExplorationMode} from "./explorationParams";
import {JurPerson} from "../../model/jurPerson/JurPerson";

class JurPersonExplorationState implements EntityExplorationState<JurPerson> {
    private readonly _data: EntityExplorationData<any>;
    private readonly _params: JurPerson;


    constructor(data: EntityExplorationData<any>, params: JurPerson) {
        this._data = data;
        this._params = params;
    }


    get data(): EntityExplorationData<any> {
        return this._data;
    }

    get params(): JurPerson {
        return this._params;
    }
}


class JurPersonExplorationParams {
    private readonly _mode: ExplorationMode = ExplorationMode.BY_ID;
    private readonly _id: string | null = null;


    constructor(id?: string, mode?: ExplorationMode) {
        if (id) {
            this._id = id;
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

}

class JurPersonExplorationData implements EntityExplorationData<JurPerson> {
    private readonly _data: Array<JurPerson> | null = null;

    constructor(data: Array<JurPerson> | null) {
        this._data = data;
    }

    get(): Array<JurPerson> | null {
        return this._data;
    }
}