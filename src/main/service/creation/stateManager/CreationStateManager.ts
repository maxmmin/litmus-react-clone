import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import {LitmusAsyncThunkConfig} from "../../../redux/store";

interface CreationStateManager<E> {
    getCreationState(): EntityCreationState<E>;
    create(thunk: AsyncThunkAction<unknown, unknown, LitmusAsyncThunkConfig>): Promise<PayloadAction<unknown, string, unknown>>;
    getCreationParams(): EntityCreationState<E>['emergingEntity'];
    setEntityCreationParams(params: EntityCreationState<E>["emergingEntity"]): void;
    updateEntityCreationParams(params: Partial<EntityCreationState<E>["emergingEntity"]>): void;
}

export default CreationStateManager;