import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import {LitmusAsyncThunkConfig} from "../../../redux/store";
import {ValidationErrors} from "../../ValidationErrors";
import CreationTypedAction from "../../../redux/actions/CreationTypedAction";

interface CreationStateManager<E> {
    getCreationActions(): CreationTypedAction;
    getCreationState(): EntityCreationState<E>;
    getValidationErrors(): ValidationErrors<E>;
    setValidationErrors(errors: ValidationErrors<E>): void;
    updateValidationErrors(errors: ValidationErrors<E>): void;
    create(thunk: AsyncThunkAction<unknown, unknown, LitmusAsyncThunkConfig>): Promise<PayloadAction<unknown, string, unknown>>;
    getCreationParams(): EntityCreationState<E>['emergingEntity'];
    setEntityCreationParams(params: EntityCreationState<E>["emergingEntity"]): void;
    updateEntityCreationParams(params: Partial<EntityCreationState<E>["emergingEntity"]>): void;
}

export default CreationStateManager;