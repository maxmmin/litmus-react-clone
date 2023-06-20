import EntityCreationState from "../../../redux/types/creation/EntityCreationState";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import {LitmusAsyncThunkConfig} from "../../../redux/store";

interface CreationStateManager<E,S extends EntityCreationState<E>> {
    getCreationState(): S;
    create(thunk: AsyncThunkAction<unknown, unknown, LitmusAsyncThunkConfig>): Promise<PayloadAction<unknown, string, unknown>>;
    getCreationParams(): S["emergingEntity"];
    setEntityCreationParams(params: S["emergingEntity"]): void;
    updateEntityCreationParams(params: Partial<S["emergingEntity"]>): void;
}

export default CreationStateManager;