import store, {AppDispatch, LitmusAsyncThunkConfig} from "../../../redux/store";
import {ExplorationCoreAction, ExplorationTypedActions} from "../../../redux/exploration/ExplorationActions";
import {setExploredEntityAction} from "../../../redux/exploration/explorationReducer";
import JurPersonExplorationState from "../../../redux/exploration/types/jurPerson/JurPersonExplorationState";
import PersonExplorationState from "../../../redux/exploration/types/human/person/PersonExplorationState";
import UserExplorationState from "../../../redux/exploration/types/human/user/UserExplorationState";
import EntityExplorationState from "../../../redux/exploration/types/EntityExplorationState";
import EntityExplorationParams from "../../../redux/exploration/types/EntityExplorationParams";
import {Entity} from "../../../model/Entity";
import ExplorationMode from "../../../redux/exploration/types/ExplorationMode";
import {AsyncThunkAction, PayloadAction} from "@reduxjs/toolkit";
import ExplorationStateManager from "./ExplorationStateManager";
import deepCopy from "../../../util/deepCopy";

/**
 * S - entityExplorationState
 * */
class ExplorationStateManagerImpl<S extends EntityExplorationState<unknown, EntityExplorationParams>> implements ExplorationStateManager<S> {
    private readonly dispatch: AppDispatch;

    private readonly actions: ExplorationTypedActions;

    public readonly entity: Entity;

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

    private constructor(entity: Entity, dispatch: AppDispatch, getState: ()=>S, actions: ExplorationTypedActions) {
        this.entity = entity;
        this.dispatch = dispatch;
        this.getExplorationState = getState;
        this.actions = actions;
    }

    static getJurPersonManager (providedStore: typeof store = store): ExplorationStateManagerImpl<JurPersonExplorationState> {
        const getState = ()=>providedStore.getState().exploration.jurPerson as JurPersonExplorationState
        return new ExplorationStateManagerImpl<JurPersonExplorationState>(Entity.JUR_PERSON, providedStore.dispatch, getState,  ExplorationTypedActions.jurPerson);
    }

    static getPersonManager (providedStore: typeof store = store): ExplorationStateManagerImpl<PersonExplorationState> {
        const getState = ()=>providedStore.getState().exploration.person as PersonExplorationState;
        return new ExplorationStateManagerImpl<PersonExplorationState>(Entity.PERSON, providedStore.dispatch,getState, ExplorationTypedActions.person);
    }

    static getUserManager (providedStore: typeof store = store): ExplorationStateManagerImpl<UserExplorationState> {
        const getState = ()=>providedStore.getState().exploration.user as UserExplorationState;
        return new ExplorationStateManagerImpl<UserExplorationState>(Entity.USER, providedStore.dispatch,getState, ExplorationTypedActions.user);
    }

    static getEntityManager(entity: Entity, providedStore: typeof store = store): ExplorationStateManagerImpl<EntityExplorationState<unknown, EntityExplorationParams>> {
        switch (entity) {
            case Entity.PERSON: {
                return ExplorationStateManagerImpl.getPersonManager(providedStore);
            }

            case Entity.JUR_PERSON: {
                return ExplorationStateManagerImpl.getJurPersonManager(providedStore);
            }

            case Entity.USER: {
                return ExplorationStateManagerImpl.getUserManager(providedStore);
            }

            default: throw new Error("unsupported entity");
        }
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