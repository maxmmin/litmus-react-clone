import {
    Entity, EntityExplorationData, EntityExplorationParams,
    EntityExplorationState, ExplorationMode,
} from "./EntityExplorationState";
import {AppDispatch} from "../store";
import {ExplorationCoreAction, ExplorationTypedActions} from "./ExplorationActions";
import {setExploredEntityAction} from "./explorationReducer";
import store from "../store";
import JurPersonExplorationState from "./jurPerson/JurPersonExplorationState";
import PersonExplorationState from "./person/PersonExplorationState";
import UserExplorationState from "./user/UserExplorationState";
import UserExplorationParams from "./user/UserExplorationParams";
import PersonExplorationParams from "./person/PersonExplorationParams";
import JurPersonExplorationParams from "./jurPerson/JurPersonExplorationParams";

/**
 * S - entityExplorationState
 * */
class ExplorationStateManager <S extends EntityExplorationState<any, EntityExplorationParams>> {
    private readonly dispatch;

    private readonly actions: ExplorationTypedActions;

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

    private constructor(dispatch: AppDispatch, getState: ()=>S, actions: ExplorationTypedActions) {
        this.dispatch = dispatch;
        this.getExplorationState = getState;
        this.actions = actions;
    }

    static getJurPersonManager (providedStore: typeof store): ExplorationStateManager<JurPersonExplorationState> {
        const getState = ()=>providedStore.getState().exploration.jurPerson as JurPersonExplorationState
        return new ExplorationStateManager<JurPersonExplorationState>(providedStore.dispatch, getState,  ExplorationTypedActions.jurPerson);
    }

    static getPersonManager (providedStore: typeof store): ExplorationStateManager<PersonExplorationState> {
        const getState = ()=>providedStore.getState().exploration.person as PersonExplorationState;
        return new ExplorationStateManager<PersonExplorationState>(providedStore.dispatch,getState, ExplorationTypedActions.person);
    }

    static getUserManager (providedStore: typeof store): ExplorationStateManager<UserExplorationState> {
        const getState = ()=>providedStore.getState().exploration.user as UserExplorationState;
        return new ExplorationStateManager<UserExplorationState>(providedStore.dispatch,getState, ExplorationTypedActions.user);
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

    updateDataResults(data: S['data']['results']) {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_DATA_RESULTS],
            payload: data
        })
    }

    enableDataPending (): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_DATA_PENDING],
            payload: true
        })
    }

    disableDataPending (): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_DATA_PENDING],
            payload: false
        })
    }

    switchExplorationMode(mode: ExplorationMode): void {
        switch (this.actions) {
            case ExplorationTypedActions.user: {
                this.checkSupport(mode, UserExplorationParams.supportedModes);
                break;
            }
            case ExplorationTypedActions.person: {
                this.checkSupport(mode, PersonExplorationParams.supportedModes);
                break;
            }
            case ExplorationTypedActions.jurPerson: {
                this.checkSupport(mode, JurPersonExplorationParams.supportedModes);
                break;
            }
        }
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS_MODE],
            payload: mode
        })
    }

    checkSupport(mode: ExplorationMode, supported: ExplorationMode[]) {
        if (!this.isSupported(mode, supported)) {
            throw new Error("mode is not supported");
        }
    }

    isSupported (mode: ExplorationMode, supported: ExplorationMode[]) {
        return supported.includes(mode);
    }

}

export default ExplorationStateManager;