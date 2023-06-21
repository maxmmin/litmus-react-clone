import store, {AppDispatch, LitmusAsyncThunkConfig} from "../../../redux/store";
import {ExplorationCoreAction} from "../../../redux/actions/ExplorationActions";
import {setExploredEntityAction} from "../../../redux/reducers/explorationStateReducer";
import BasicJurPersonExplorationState from "../../../redux/types/exploration/jurPerson/JurPersonExplorationState";
import PersonExplorationState from "../../../redux/types/exploration/human/person/PersonExplorationState";
import UserExplorationState from "../../../redux/types/exploration/human/user/UserExplorationState";
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
class ExplorationStateManagerImpl<E,S extends EntityExplorationState<E, EntityExplorationParams>> implements ExplorationStateManager<E,S> {
    private readonly dispatch: AppDispatch;

    private readonly actions: ExplorationTypedAction;

    static switchEntity (entity: Entity, dispatch: AppDispatch) {
        dispatch({
            type: setExploredEntityAction,
            payload: entity
        })
    }

    public getExplorationState: ()=>S;

    public getExplorationData (): S["data"] {
        return this.getExplorationState().data;
    }

    public getExplorationParams(): S["params"] {
        return this.getExplorationState().params;
    }

    public constructor(dispatch: AppDispatch, getState: ()=>S, actions: ExplorationTypedAction) {
        this.dispatch = dispatch;
        this.getExplorationState = getState;
        this.actions = actions;
    }

    setState (state: S): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.SET_EXPLORATION_STATE],
            payload: deepCopy(state)
        })
    }

    setParams (params: S['params']): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.SET_EXPLORATION_PARAMS],
            payload: deepCopy(params)
        })
    }

    updateParams (params: Partial<S['params']>): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS],
            payload: deepCopy(params)
        })
    }


    setData (data: S['data']): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.RETRIEVE_DATA],
            payload: deepCopy(data)
        })
    }

    retrieveData(thunk: AsyncThunkAction<S["data"], unknown, LitmusAsyncThunkConfig>):  Promise<PayloadAction<unknown, string, unknown>> {
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
            payload: deepCopy(mode)
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