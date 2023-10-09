import {AppDispatch, LitmusAsyncThunkConfig} from "../../../redux/store";
import CreationCoreAction from "../../../redux/actions/CreationCoreAction";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import CreationTypedAction from "../../../redux/actions/CreationTypedAction";
import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import CreationStateManager from "./CreationStateManager";
import {Entity} from "../../../model/Entity";
import {selectEmergingEntityAction} from "../../../redux/reducers/creationStateReducer";
import {ValidationErrors} from "../../ValidationErrors";

class CreationStateManagerImpl<E,C=E,V=ValidationErrors<C>> implements CreationStateManager<E,C,V> {
    protected readonly dispatch: AppDispatch;
    protected readonly getState: ()=>EntityCreationState<C,V>;
    protected readonly actions: CreationTypedAction;

    constructor(dispatch: AppDispatch, getState: () => EntityCreationState<C,V>, actions: CreationTypedAction) {
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

    getCreationParams(): EntityCreationState<C>["emergingEntity"] {
        return this.getState().emergingEntity;
    }

    getCreationState(): EntityCreationState<C,V> {
        return this.getState();
    }

    async create(thunk: AsyncThunkAction<E, unknown, LitmusAsyncThunkConfig>): Promise<E> {
        return this.dispatch(thunk).unwrap();
    }

    public setEntityCreationParams(entityCreationParams: EntityCreationState<C>["emergingEntity"]) {
        const action: PayloadAction<EntityCreationState<C>["emergingEntity"]> = {
            type: this.actions[CreationCoreAction.SET_ENTITY_CREATION_PARAMS],
            payload: entityCreationParams
        }
        this.dispatch(action);
    }

    public updateEntityCreationParams(entityCreationParams: Partial<EntityCreationState<C>["emergingEntity"]>) {
        const action: PayloadAction<Partial<EntityCreationState<C>["emergingEntity"]>> = {
            type: this.actions["UPDATE_CREATION_PARAMS"],
            payload: entityCreationParams
        }
        this.dispatch(action);
    }

}

export default CreationStateManagerImpl;