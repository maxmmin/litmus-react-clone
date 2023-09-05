import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import {LitmusAsyncThunkConfig} from "../../../redux/store";
import {ValidationErrors} from "../../ValidationErrors";
import CreationTypedAction from "../../../redux/actions/CreationTypedAction";

/**
 * E - entity
 * V - validation object
 */

interface CreationStateManager<E, V=ValidationErrors<E>> {
    getCreationActions(): CreationTypedAction;
    getCreationState(): EntityCreationState<E,V>;
    getValidationErrors(): V;
    setValidationErrors(errors: V): void;
    updateValidationErrors(errors: Partial<V>): void;
    create(thunk:  AsyncThunkAction<E, unknown, LitmusAsyncThunkConfig>): Promise<E>;
    getCreationParams(): EntityCreationState<E,V>['emergingEntity'];
    setEntityCreationParams(params: EntityCreationState<E,V>["emergingEntity"]): void;
    updateEntityCreationParams(params: Partial<EntityCreationState<E,V>["emergingEntity"]>): void;
}

export default CreationStateManager;