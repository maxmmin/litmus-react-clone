import {JurPerson} from "../../model/jurPerson/JurPerson";
import {Entity, EntityExplorationData, EntityExplorationParams, EntityExplorationState} from "./EntityExplorationState";
import Person from "../../model/person/Person";
import User from "../../model/user/User";
import {JurPersonExplorationParams} from "./JurPersonExploration";
import {PersonExplorationParams} from "./PersonExploration";
import {UserExplorationParams} from "./UserExploration";
import {AppDispatch} from "../store";

enum ExplorationAction{
    UPDATE_EXPLORATION_STATE="UPDATE_EXPLORATION_PARAMS",
    UPDATE_EXPLORATION_PARAMS="UPDATE_EXPLORATION_PARAMS",
    UPDATE_EXPLORATION_DATA="UPDATE_EXPLORATION_DATA"
}

/**
 * E - entity
 * P -params
 */

type EntityActions = typeof ExplorationStateManager.personActions | typeof ExplorationStateManager.userActions | typeof ExplorationStateManager.jurPersonActions;

class ExplorationStateManager <E, P extends EntityExplorationParams> {
    private readonly dispatch;

    private static readonly userBase = "USER";
    private static readonly personBase = "PERSON";
    private static readonly jurPersonBase = "JUR_PERSON";
    private static readonly delimiter = "@";

    public static readonly userActions: Record<ExplorationAction, string> = {
        [ExplorationAction.UPDATE_EXPLORATION_STATE]: ExplorationStateManager.userBase+ExplorationStateManager.delimiter+ExplorationAction.UPDATE_EXPLORATION_STATE,
        [ExplorationAction.UPDATE_EXPLORATION_PARAMS]: ExplorationStateManager.userBase+ExplorationStateManager.delimiter+ExplorationAction.UPDATE_EXPLORATION_PARAMS,
        [ExplorationAction.UPDATE_EXPLORATION_DATA]: ExplorationStateManager.userBase+ExplorationStateManager.delimiter+ExplorationAction.UPDATE_EXPLORATION_DATA
    }

    public static readonly personActions: Record<ExplorationAction, string> = {
        [ExplorationAction.UPDATE_EXPLORATION_STATE]: ExplorationStateManager.personBase+ExplorationStateManager.delimiter+ExplorationAction.UPDATE_EXPLORATION_STATE,
        [ExplorationAction.UPDATE_EXPLORATION_PARAMS]: ExplorationStateManager.personBase+ExplorationStateManager.delimiter+ExplorationAction.UPDATE_EXPLORATION_PARAMS,
        [ExplorationAction.UPDATE_EXPLORATION_DATA]: ExplorationStateManager.personBase+ExplorationStateManager.delimiter+ExplorationAction.UPDATE_EXPLORATION_DATA
    }

    public static readonly jurPersonActions: Record<ExplorationAction, string> = {
        [ExplorationAction.UPDATE_EXPLORATION_STATE]: ExplorationStateManager.jurPersonBase+ExplorationStateManager.delimiter+ExplorationAction.UPDATE_EXPLORATION_STATE,
        [ExplorationAction.UPDATE_EXPLORATION_PARAMS]: ExplorationStateManager.jurPersonBase+ExplorationStateManager.delimiter+ExplorationAction.UPDATE_EXPLORATION_PARAMS,
        [ExplorationAction.UPDATE_EXPLORATION_DATA]: ExplorationStateManager.jurPersonBase+ExplorationStateManager.delimiter+ExplorationAction.UPDATE_EXPLORATION_DATA
    }

    private readonly actions: EntityActions;

    private constructor(dispatch: AppDispatch, actions: EntityActions) {
        this.dispatch = dispatch;
        this.actions = actions;
    }

    static getManager (dispatch: AppDispatch, entityType: Entity) {
        switch (entityType) {
            case Entity.JUR_PERSONS: {
                return new ExplorationStateManager<JurPerson, JurPersonExplorationParams>(dispatch, ExplorationStateManager.jurPersonActions);
            }

            case Entity.PERSONS: {
                return new ExplorationStateManager<Person, PersonExplorationParams>(dispatch, ExplorationStateManager.personActions);
            }

            case Entity.USERS: {
                return new ExplorationStateManager<User, UserExplorationParams>(dispatch, ExplorationStateManager.userActions);
            }

            default: throw new Error("provided unknown entity type")
        }
    }

    updateState (state: EntityExplorationState<E, P>): void {
        this.dispatch({
            type: this.actions[ExplorationAction.UPDATE_EXPLORATION_STATE],
            payload: state
        })
    }

    updateParams (params: P): void {
        this.dispatch({
            type: this.actions[ExplorationAction.UPDATE_EXPLORATION_PARAMS],
            payload: params
        })
    }

    updateData (data: EntityExplorationData<E>): void {
        this.dispatch({
            type: this.actions[ExplorationAction.UPDATE_EXPLORATION_DATA],
            payload: data
        })
    }

}

export default ExplorationStateManager;