import store from "../../redux/store";
import CreationCoreActions, {PersonCreationParams} from "../../redux/creation/CreationCoreActions";
import {PayloadAction} from "@reduxjs/toolkit";
import CreationTypedActions from "../../redux/creation/CreationTypedActions";
import EntityCreationState from "../../redux/creation/EntityCreationState";

class EntityCreationStateManagerImpl<S extends EntityCreationState<unknown>>  {
    private readonly _store: typeof store;

    private readonly actions: CreationTypedActions;

    constructor(actions: CreationTypedActions, _store: typeof store = store) {
        this._store = _store;
        this.actions = actions;
    }

    public setEntityCreationParams(entityCreationParams: S["params"]) {
        const action: PayloadAction<S["params"]> = {
            type: this.actions[CreationCoreActions.SET_ENTITY_CREATION_PARAMS],
            payload: entityCreationParams
        }
        this._store.dispatch(action);
    }

    public updateEntityCreationParams(entityCreationParams: Partial<S["params"]>) {
        const action: PayloadAction<Partial<S["params"]>> = {
            type: this.actions["UPDATE_CREATION_PARAMS"],
            payload: entityCreationParams
        }
        this._store.dispatch(action);
    }
}