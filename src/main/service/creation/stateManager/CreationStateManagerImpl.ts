import {AppDispatch} from "../../../redux/store";
import CreationCoreActions from "../../../redux/creation/CreationCoreActions";
import {PayloadAction} from "@reduxjs/toolkit";
import CreationTypedAction from "../../../redux/creation/CreationTypedActions";
import EntityCreationState from "../../../redux/creation/EntityCreationState";
import CreationStateManager from "./CreationStateManager";

class CreationStateManagerImpl<S extends EntityCreationState<unknown>> implements CreationStateManager<S> {
    protected readonly dispatch: AppDispatch;
    protected readonly getState: ()=>S;
    protected readonly actions: CreationTypedAction;


    constructor(dispatch: AppDispatch, getState: () => S, actions: CreationTypedAction) {
        this.dispatch = dispatch;
        this.getState = getState;
        this.actions = actions;
    }

    public setEntityCreationParams(entityCreationParams: S["params"]) {
        const action: PayloadAction<S["params"]> = {
            type: this.actions[CreationCoreActions.SET_ENTITY_CREATION_PARAMS],
            payload: entityCreationParams
        }
        this.dispatch(action);
    }

    public updateEntityCreationParams(entityCreationParams: Partial<S["params"]>) {
        const action: PayloadAction<Partial<S["params"]>> = {
            type: this.actions["UPDATE_CREATION_PARAMS"],
            payload: entityCreationParams
        }
        this.dispatch(action);
    }

}

export default CreationStateManagerImpl;