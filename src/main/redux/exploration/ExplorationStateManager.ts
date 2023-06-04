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
 * E - entityService
 * P -params
 */
class ExplorationStateManager <E,P extends EntityExplorationParams> {
    private readonly dispatch;

    private readonly actions: ExplorationTypedActions;

    static switchEntity (entity: Entity, dispatch: AppDispatch) {
        dispatch({
            type: setExploredEntityAction,
            payload: entity
        })
    }

    public getExplorationState: ()=>EntityExplorationState<E, P>;

    public getExplorationData (): EntityExplorationData<E> {
        return this.getExplorationState().data;
    }

    public getExplorationParams(): P {
        return this.getExplorationState().params;
    }

    private constructor(dispatch: AppDispatch, getState: ()=>EntityExplorationState<E, P>, actions: ExplorationTypedActions) {
        this.dispatch = dispatch;
        this.getExplorationState = getState;
        this.actions = actions;
    }

    static getJurPersonManager (providedStore: typeof store): ExplorationStateManager<JurPerson, JurPersonExplorationParams> {
        const getState = ()=>providedStore.getState().exploration.jurPerson as JurPersonExplorationState
        return new ExplorationStateManager<JurPerson, JurPersonExplorationParams>(providedStore.dispatch, getState,  ExplorationTypedActions.jurPerson);
    }

    static getPersonManager (providedStore: typeof store): ExplorationStateManager<Person, PersonExplorationParams> {
        const getState = ()=>providedStore.getState().exploration.person as PersonExplorationState;
        return new ExplorationStateManager<Person, PersonExplorationParams>(providedStore.dispatch,getState, ExplorationTypedActions.person);
    }

    static getUserManager (providedStore: typeof store): ExplorationStateManager<User, UserExplorationParams> {
        const getState = ()=>providedStore.getState().exploration.user as UserExplorationState;
        return new ExplorationStateManager<User, UserExplorationParams>(providedStore.dispatch,getState, ExplorationTypedActions.user);
    }


    updateState (state: EntityExplorationState<E, P>): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_STATE],
            payload: state
        })
    }

    updateParams (params: EntityExplorationState<E, P>): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS],
            payload: params
        })
    }

    updateData (data: EntityExplorationData<E>): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_DATA],
            payload: data
        })
    }

    updateDataResults(data: EntityExplorationData<E>['results']) {
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