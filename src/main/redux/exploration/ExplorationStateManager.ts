import store, {AppDispatch} from "../store";
import {ExplorationCoreAction, ExplorationTypedActions} from "./ExplorationActions";
import {setExploredEntityAction} from "./explorationReducer";
import JurPersonExplorationState from "./jurPerson/JurPersonExplorationState";
import PersonExplorationState from "./human/person/PersonExplorationState";
import UserExplorationState from "./human/user/UserExplorationState";
import EntityExplorationState from "./EntityExplorationState";
import EntityExplorationParams from "./EntityExplorationParams";
import {Entity} from "./Entity";
import ExplorationMode from "./ExplorationMode";

/**
 * S - entityExplorationState
 * */
class ExplorationStateManager <S extends EntityExplorationState<any, EntityExplorationParams>> {
    private readonly dispatch;

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

    static getJurPersonManager (providedStore: typeof store): ExplorationStateManager<JurPersonExplorationState> {
        const getState = ()=>providedStore.getState().exploration.jurPerson as JurPersonExplorationState
        return new ExplorationStateManager<JurPersonExplorationState>(Entity.JUR_PERSON, providedStore.dispatch, getState,  ExplorationTypedActions.jurPerson);
    }

    static getPersonManager (providedStore: typeof store): ExplorationStateManager<PersonExplorationState> {
        const getState = ()=>providedStore.getState().exploration.person as PersonExplorationState;
        return new ExplorationStateManager<PersonExplorationState>(Entity.PERSON, providedStore.dispatch,getState, ExplorationTypedActions.person);
    }

    static getUserManager (providedStore: typeof store): ExplorationStateManager<UserExplorationState> {
        const getState = ()=>providedStore.getState().exploration.user as UserExplorationState;
        return new ExplorationStateManager<UserExplorationState>(Entity.USER, providedStore.dispatch,getState, ExplorationTypedActions.user);
    }

    static getEntityManager(providedStore: typeof store, entity: Entity): ExplorationStateManager<EntityExplorationState<any, EntityExplorationParams>> {
        switch (entity) {
            case Entity.PERSON: {
                return ExplorationStateManager.getPersonManager(store);
            }

            case Entity.JUR_PERSON: {
                return ExplorationStateManager.getJurPersonManager(store);
            }

            case Entity.USER: {
                return ExplorationStateManager.getUserManager(store);
            }

            default: throw new Error("unsupported entity");
        }
    }

    updateState (state: S): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_STATE],
            payload: state
        })
    }

    updateParams (params: S['params']): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS],
            payload: params
        })
    }

    updateData (data: S['data']): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_DATA],
            payload: data
        })
    }

    enablePending (): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_DATA_PENDING],
            payload: true
        })
    }

    disablePending (): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_DATA_PENDING],
            payload: false
        })
    }

    switchExplorationMode(mode: ExplorationMode): void {
        this.checkSupport(mode);

        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS_MODE],
            payload: mode
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

export default ExplorationStateManager;