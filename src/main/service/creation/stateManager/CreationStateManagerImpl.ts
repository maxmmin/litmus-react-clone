import {AppDispatch, LitmusAsyncThunkConfig} from "../../../redux/store";
import CreationCoreAction from "../../../redux/actions/CreationCoreAction";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import CreationTypedAction from "../../../redux/actions/CreationTypedAction";
import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import CreationStateManager from "./CreationStateManager";
import {Entity} from "../../../model/Entity";
import {selectEmergingEntityAction} from "../../../redux/reducers/creationStateReducer";
import {ValidationErrors} from "../../ValidationErrors";

class CreationStateManagerImpl<E,V=ValidationErrors<E>> implements CreationStateManager<E,V> {
    protected readonly dispatch: AppDispatch;
    protected readonly getState: ()=>EntityCreationState<E,V>;
    protected readonly actions: CreationTypedAction;

    constructor(dispatch: AppDispatch, getState: () => EntityCreationState<E,V>, actions: CreationTypedAction) {
        this.dispatch = dispatch;
        this.getState = getState;
        this.actions = actions;
    }

    getCreationActions(): CreationTypedAction {
        return this.actions;
    }

    getValidationErrors(): V {
        return this.getState().validationErrors;
    }

    setValidationErrors(errors: V): void {
        this.dispatch({
            type: this.actions["SET_ENTITY_VALIDATION_ERRORS"],
            payload: errors
        })
    }

    updateValidationErrors(errors: Partial<V>): void {
        this.dispatch({
            type: this.actions["UPDATE_ENTITY_VALIDATION_ERRORS"],
            payload: errors
        })
    }

    static switchEntity (entity: Entity, dispatch: AppDispatch) {
        dispatch({
            type: selectEmergingEntityAction,
            payload: entity
        })
    }

    getCreationParams(): EntityCreationState<E>["emergingEntity"] {
        return this.getState().emergingEntity;
    }

    getCreationState(): EntityCreationState<E,V> {
        return this.getState();
    }

    async create(thunk: AsyncThunkAction<E, unknown, LitmusAsyncThunkConfig>): Promise<E> {
        return this.dispatch(thunk).unwrap();
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