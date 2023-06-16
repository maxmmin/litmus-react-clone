import store from "../../redux/store";
import CreationCoreActions, {PersonCreationParams} from "../../redux/creation/CreationCoreActions";
import {Action} from "redux";
import {PayloadAction} from "@reduxjs/toolkit";

class CreationStateManager {
    private _store: typeof store;

    constructor(_store: typeof store = store) {
        this._store = _store;
    }

    public setPersonCreationParams(personCreationParams: PersonCreationParams) {
        const action: PayloadAction<PersonCreationParams,CreationCoreActions> = {
            type: CreationCoreActions.SET_PERSON_CREATION_DATA,
            payload: personCreationParams
        }
        this._store.dispatch(action);
    }

    public updatePersonCreationParams(personCreationParams: Partial<PersonCreationParams>) {
        const action: PayloadAction<Partial<PersonCreationParams>,CreationCoreActions> = {
            type: CreationCoreActions.UPDATE_PERSON_CREATION_DATA,
            payload: personCreationParams
        }
        this._store.dispatch(action);
    }
}