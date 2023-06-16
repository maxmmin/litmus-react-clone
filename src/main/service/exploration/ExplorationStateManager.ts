import EntityExplorationState from "../../redux/exploration/types/EntityExplorationState";
import EntityExplorationParams from "../../redux/exploration/types/EntityExplorationParams";
import {AsyncThunkAction} from "@reduxjs/toolkit";
import ExplorationMode from "../../redux/exploration/types/ExplorationMode";

export default interface ExplorationStateManager <S extends EntityExplorationState<unknown, EntityExplorationParams>> {
    getExplorationState: ()=>S;

    getExplorationData (): S["data"];

    getExplorationParams(): S["params"];

    setState (state: S): void;

    updateParams (params: Partial<S['params']>): void;

    setParams (params: S['params']): void;

    setData (data: S['data']): void;

    //@todo maybe make return promise of thunk dispatch
    retrieveData(thunk: AsyncThunkAction<S["data"], any, any>): void

    enableSectionPending (): void;

    disableSectionPending (): void;

    switchExplorationMode(mode: ExplorationMode): void;
}