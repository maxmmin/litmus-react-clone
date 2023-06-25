import {AppDispatch, LitmusAsyncThunkConfig} from "../../../redux/store";
import CreationCoreAction from "../../../redux/actions/CreationCoreAction";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import CreationTypedAction from "../../../redux/actions/CreationTypedAction";
import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import CreationStateManager from "./CreationStateManager";
import {Entity} from "../../../model/Entity";
import {setEmergingEntityAction} from "../../../redux/reducers/creationStateReducer";

class CreationStateManagerImpl<E> implements CreationStateManager<E> {
    protected readonly dispatch: AppDispatch;
    protected readonly getState: ()=>EntityCreationState<E>;
    protected readonly actions: CreationTypedAction;

    constructor(dispatch: AppDispatch, getState: () => EntityCreationState<E>, actions: CreationTypedAction) {
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

    getCreationParams(): EntityCreationState<E>["emergingEntity"] {
        return this.getState().emergingEntity;
    }

    getCreationState(): EntityCreationState<E> {
        return this.getState();
    }

    create(thunk: AsyncThunkAction<unknown, unknown, LitmusAsyncThunkConfig>): Promise<PayloadAction<unknown, string, unknown>> {
        return this.dispatch(thunk);
    }

    public setEntityCreationParams(entityCreationParams: EntityCreationState<E>["emergingEntity"]) {
        const action: PayloadAction<EntityCreationState<E>["emergingEntity"]> = {
            type: this.actions[CreationCoreAction.SET_ENTITY_CREATION_PARAMS],
            payload: entityCreationParams
        }
        this.dispatch(action);
    }

    public updateEntityCreationParams(entityCreationParams: Partial<EntityCreationState<E>["emergingEntity"]>) {
        const action: PayloadAction<Partial<EntityCreationState<E>["emergingEntity"]>> = {
            type: this.actions["UPDATE_CREATION_PARAMS"],
            payload: entityCreationParams
        }
        this.dispatch(action);
    }

}

export default CreationStateManagerImpl;