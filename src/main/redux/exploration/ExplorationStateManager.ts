import {JurPerson} from "../../model/jurPerson/JurPerson";
import {
    Entity,
    EntityExplorationData,
    EntityExplorationParams,
    EntityExplorationState, ExplorationMode,
} from "./EntityExplorationState";
import Person from "../../model/person/Person";
import User from "../../model/user/User";
import {JurPersonExplorationParams} from "./JurPersonExploration";
import {PersonExplorationParams} from "./PersonExploration";
import {UserExplorationParams} from "./UserExploration";
import {AppDispatch} from "../store";
import {ExplorationCoreAction, ExplorationTypedActions} from "./ExplorationActions";
import {setExploredEntityAction} from "./explorationReducer";

/**
 * E - entity
 * P -params
 */
class ExplorationStateManager <E, P extends EntityExplorationParams> {
    private readonly dispatch;

    private readonly actions: ExplorationTypedActions;

    static switchEntity (entity: Entity, dispatch: AppDispatch) {
        dispatch({
            type: setExploredEntityAction,
            payload: entity
        })
    }

    private constructor(dispatch: AppDispatch, actions: ExplorationTypedActions) {
        this.dispatch = dispatch;
        this.actions = actions;
    }

    static getManager (dispatch: AppDispatch, entityType: Entity) {
        switch (entityType) {
            case Entity.JUR_PERSON: {
                return new ExplorationStateManager<JurPerson, JurPersonExplorationParams>(dispatch, ExplorationTypedActions.jurPerson);
            }

            case Entity.PERSON: {
                return new ExplorationStateManager<Person, PersonExplorationParams>(dispatch, ExplorationTypedActions.person);
            }

            case Entity.USER: {
                return new ExplorationStateManager<User, UserExplorationParams>(dispatch, ExplorationTypedActions.user);
            }

            default: throw new Error("provided unknown entity type")
        }
    }

    updateState (state: EntityExplorationState<E, P>): void {
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_STATE],
            payload: state
        })
    }

    updateParams (params: P): void {
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

    switchExplorationMode(mode: ExplorationMode): void {
        switch (this.actions) {
            case ExplorationTypedActions.user: {
                console.log(new UserExplorationParams().supportedModes)
            }
        }
        this.dispatch({
            type: this.actions[ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS_MODE],
            payload: mode
        })
    }

}

export default ExplorationStateManager;