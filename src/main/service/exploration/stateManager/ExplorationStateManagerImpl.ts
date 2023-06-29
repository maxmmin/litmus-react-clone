import {AppDispatch, LitmusAsyncThunkConfig} from "../../../redux/store";
import {ExplorationCoreAction} from "../../../redux/actions/ExplorationActions";
import {setExploredEntityAction} from "../../../redux/reducers/explorationStateReducer";
import EntityExplorationState from "../../../redux/types/exploration/EntityExplorationState";
import EntityExplorationParams from "../../../redux/types/exploration/EntityExplorationParams";
import ExplorationMode from "../../../redux/types/exploration/ExplorationMode";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import ExplorationStateManager from "./ExplorationStateManager";
import deepCopy from "../../../util/deepCopy";
import {ExplorationTypedAction} from "../../../redux/actions/ExplorationTypedAction";
import {Entity} from "../../../model/Entity";

/**
 * E - entity
 * S - entityExplorationState
 * */
class ExplorationStateManagerImpl<E,P extends EntityExplorationParams> implements ExplorationStateManager<E,P> {
    private readonly dispatch: AppDispatch;

    private readonly actions: ExplorationTypedAction;

    static switchEntity (entity: Entity, dispatch: AppDispatch) {
        dispatch({
            type: setExploredEntityAction,
            payload: entity
        })
    }

    public getExplorationState: ()=>EntityExplorationState<E, P>;

    public getExplorationData (): EntityExplorationState<E, P>["data"] {
        return this.getExplorationState().data;
    }

    public getExplorationParams(): EntityExplorationState<E, P>["params"] {
        return this.getExplorationState().params;
    }

    public getValidationErrors(): EntityExplorationState<E, P>["validationErrors"] {
        return this.getExplorationState().validationErrors;
    }

    public constructor(dispatch: AppDispatch, getState: ()=>EntityExplorationState<E, P>, actions: ExplorationTypedAction) {
        this.dispatch = dispatch;
        this.getExplorationState = getState;
        this.actions = actions;
    }

    setState (state: EntityExplorationState<E, P>): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.SET_EXPLORATION_STATE],
            payload: deepCopy(state)
        })
    }

    setValidationErrors(errors: Partial<Record<keyof P, string>>): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.SET_EXPLORATION_VALIDATION_ERRORS],
            payload: errors
        })
    }

    updateValidationErrors(errors: Partial<Record<keyof P, string>>): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_VALIDATION_ERRORS],
            payload: errors
        })
    }




    setParams (params: EntityExplorationState<E, P>['params']): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.SET_EXPLORATION_PARAMS],
            payload: deepCopy(params)
        })
    }

    updateParams (params: Partial<EntityExplorationState<E, P>['params']>): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS],
            payload: deepCopy(params)
        })
    }


    setData (data: EntityExplorationState<E, P>['data']): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.RETRIEVE_DATA],
            payload: deepCopy(data)
        })
    }

    retrieveData(thunk: AsyncThunkAction<EntityExplorationState<E, P>["data"], unknown, LitmusAsyncThunkConfig>):  Promise<PayloadAction<unknown, string, unknown>> {
        return this.dispatch(thunk);
    }

    enableSectionPending (): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.SET_EXPLORATION_STATE_PENDING],
            payload: true
        })
    }

    disableSectionPending (): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.SET_EXPLORATION_STATE_PENDING],
            payload: false
        })
    }

    switchExplorationMode(mode: ExplorationMode): void {
        this.checkSupport(mode);

        this.dispatch({
            type: this.actions[ExplorationCoreAction.SET_EXPLORATION_PARAMS_MODE],
            payload: mode.id
        })
    }

    checkSupport(mode: ExplorationMode) {
        if (!this.supports(mode)) {
            throw new Error("mode is not supported");
        }
    }

    supports (mode: ExplorationMode) {
        return this.getExplorationParams().supportedModesIdList.includes(mode.id);
    }

}

export default ExplorationStateManagerImpl;