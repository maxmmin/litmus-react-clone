import EntityExplorationState from "../../../redux/types/exploration/EntityExplorationState";
import EntityExplorationParams from "../../../redux/types/exploration/EntityExplorationParams";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import ExplorationMode from "../../../redux/types/exploration/ExplorationMode";
import {LitmusAsyncThunkConfig} from "../../../redux/store";

export default interface ExplorationStateManager <S extends EntityExplorationState<unknown, EntityExplorationParams>> {
    getExplorationState: ()=>S;

    getExplorationData (): S["data"];

    getExplorationParams(): S["params"];

    setState (state: S): void;

    updateParams (params: Partial<S['params']>): void;

    setParams (params: S['params']): void;

    setData (data: S['data']): void;

    retrieveData(thunk: AsyncThunkAction<S["data"], unknown, LitmusAsyncThunkConfig>): Promise<PayloadAction<unknown, string, unknown>>

    enableSectionPending (): void;

    disableSectionPending (): void;

    switchExplorationMode(mode: ExplorationMode): void;
}