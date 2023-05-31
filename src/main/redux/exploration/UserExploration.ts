import User from "../../model/user/User";
import {EntityExplorationData, EntityExplorationState, ExplorationMode} from "./explorationParams";

class UserExplorationState implements EntityExplorationState<UserExplorationParams> {
    private readonly _params: UserExplorationParams;
    private readonly _data: UserExplorationData;


    constructor(params: UserExplorationParams, data: UserExplorationData) {
        this._params = params;
        this._data = data;
    }

    get params(): UserExplorationParams {
        return this._params;
    }

    get data(): UserExplorationData {
        return this._data;
    }
}

class UserExplorationParams {
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

class UserExplorationData implements EntityExplorationData<User>{
    private readonly _data: Array<User> | null = null;

    constructor(users?: Array<User>) {
        if (users) {
            this._data = users;
        }
    }

    get(): Array<User> | null {
        return this._data;
    }
}