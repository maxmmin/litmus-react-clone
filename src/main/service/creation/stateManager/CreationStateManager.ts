import EntityCreationState from "../../../redux/creation/EntityCreationState";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import {LitmusAsyncThunkConfig} from "../../../redux/store";

interface CreationStateManager<S extends EntityCreationState<unknown>> {
    getCreationState(): S;
    create(thunk: AsyncThunkAction<unknown, unknown, LitmusAsyncThunkConfig>): Promise<PayloadAction<unknown, string, unknown>>;
    getCreationParams(): S["params"];
    setEntityCreationParams(params: S["params"]): void;
    updateEntityCreationParams(params: Partial<S["params"]>): void;
}

export default CreationStateManager;