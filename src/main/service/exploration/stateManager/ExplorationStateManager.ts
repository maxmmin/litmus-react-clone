import EntityExplorationState from "../../../redux/types/exploration/EntityExplorationState";
import EntityExplorationParams from "../../../redux/types/exploration/EntityExplorationParams";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import ExplorationMode from "../../../redux/types/exploration/ExplorationMode";
import {LitmusAsyncThunkConfig} from "../../../redux/store";

export default interface ExplorationStateManager <E, P extends EntityExplorationParams> {
    getExplorationState: ()=>EntityExplorationState<E, P>;

    getExplorationData (): EntityExplorationState<E, P>["data"];

    getExplorationParams(): P;

    getValidationErrors (): EntityExplorationState<E, P>["validationErrors"]

    setState (state: EntityExplorationState<E, P>): void;

    updateParams (params: Partial<EntityExplorationState<E, P>['params']>): void;

    setParams (params: EntityExplorationState<E, P>['params']): void;

    setData (data: EntityExplorationState<E, P>['data']): void;

    retrieveData(thunk: AsyncThunkAction<EntityExplorationState<E, P>["data"], unknown, LitmusAsyncThunkConfig>): Promise<PayloadAction<unknown, string, unknown>>

    enableSectionPending (): void;

    disableSectionPending (): void;

    updateValidationErrors(errors: Partial<Record<keyof P, string>>): void;

    setValidationErrors(errors: Partial<Record<keyof P, string>>): void;

    switchExplorationMode(mode: ExplorationMode): void;
}