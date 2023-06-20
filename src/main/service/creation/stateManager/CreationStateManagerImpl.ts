import {AppDispatch, LitmusAsyncThunkConfig} from "../../../redux/store";
import CreationCoreAction from "../../../redux/actions/CreationCoreAction";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import CreationTypedAction from "../../../redux/actions/CreationTypedAction";
import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import CreationStateManager from "./CreationStateManager";
import {Entity} from "../../../model/Entity";
import {setExploredEntityAction} from "../../../redux/reducers/explorationStateReducer";
import {setEmergingEntityAction} from "../../../redux/reducers/creationStateReducer";

class CreationStateManagerImpl<E,S extends EntityCreationState<E>> implements CreationStateManager<E,S> {
    protected readonly dispatch: AppDispatch;
    protected readonly getState: ()=>S;
    protected readonly actions: CreationTypedAction;


    constructor(dispatch: AppDispatch, getState: () => S, actions: CreationTypedAction) {
        this.dispatch = dispatch;
        this.getState = getState;
        this.actions = actions;
    }

    static switchEntity (entity: Entity, dispatch: AppDispatch) {
        dispatch({
            type: setEmergingEntityAction,
            payload: entity
        })
    }

    getCreationParams(): S["emergingEntity"] {
        return this.getState().emergingEntity;
    }

    getCreationState(): S {
        return this.getState();
    }

    create(thunk: AsyncThunkAction<unknown, unknown, LitmusAsyncThunkConfig>): Promise<PayloadAction<unknown, string, unknown>> {
        return this.dispatch(thunk);
    }

    public setEntityCreationParams(entityCreationParams: S["emergingEntity"]) {
        const action: PayloadAction<S["emergingEntity"]> = {
            type: this.actions[CreationCoreAction.SET_ENTITY_CREATION_PARAMS],
            payload: entityCreationParams
        }
        this.dispatch(action);
    }

    public updateEntityCreationParams(entityCreationParams: Partial<S["emergingEntity"]>) {
        const action: PayloadAction<Partial<S["emergingEntity"]>> = {
            type: this.actions["UPDATE_CREATION_PARAMS"],
            payload: entityCreationParams
        }
        this.dispatch(action);
    }

}

export default CreationStateManagerImpl;