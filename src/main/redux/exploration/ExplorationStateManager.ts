import {JurPerson} from "../../model/jurPerson/JurPerson";
import {
    Entity,
    EntityExplorationData,
    EntityExplorationParams,
    EntityExplorationState, ExplorationMode,
} from "./EntityExplorationState";
import Person from "../../model/person/Person";
import User from "../../model/user/User";
import {JurPersonExplorationParams, JurPersonExplorationState} from "./jurPerson/JurPersonExploration";
import {PersonExplorationParams, PersonExplorationState} from "./person/PersonExploration";
import {UserExplorationParams, UserExplorationState} from "./user/UserExploration";
import {AppDispatch} from "../store";
import {ExplorationCoreAction, ExplorationTypedActions} from "./ExplorationActions";
import {setExploredEntityAction} from "./explorationReducer";
import store from "../store";

/**
 * S - entityExplorationState
 * */
class ExplorationStateManager <S extends EntityExplorationState<any, any>> {
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