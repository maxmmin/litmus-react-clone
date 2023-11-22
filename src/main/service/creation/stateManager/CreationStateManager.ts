import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import {LitmusAsyncThunkConfig} from "../../../redux/store";
import {ValidationErrors} from "../../ValidationErrors";
import CreationTypedAction from "../../../redux/actions/CreationTypedAction";

/**
 * E - entity
 * C - creation params
 * V - validation object
 */

interface CreationStateManager<E, C=E, V=ValidationErrors<C>> {
    getCreationActions(): CreationTypedAction;
    getCreationState(): EntityCreationState<C,V>;
    getValidationErrors(): V;
    setValidationErrors(errors: V): void;
    updateValidationErrors(errors: Partial<V>): void;
    create(thunk:  AsyncThunkAction<E, unknown, LitmusAsyncThunkConfig>): Promise<E>;
    getCreationParams(): EntityCreationState<C,V>['emergingEntity'];
    setEntityCreationParams(params: EntityCreationState<C,V>["emergingEntity"]): void;
    updateEntityCreationParams(params: Partial<EntityCreationState<C,V>["emergingEntity"]>): void;
}

export default CreationStateManager;