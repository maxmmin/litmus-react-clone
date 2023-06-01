import {JurPerson} from "../../model/jurPerson/JurPerson";
import {Entity, EntityExplorationData, EntityExplorationParams, EntityExplorationState} from "./EntityExplorationState";
import Person from "../../model/person/Person";
import User from "../../model/user/User";
import {JurPersonExplorationParams} from "./JurPersonExploration";
import {PersonExplorationParams} from "./PersonExploration";
import {UserExplorationParams} from "./UserExploration";
import {AppDispatch} from "../store";

enum ExplorationCoreAction{
    UPDATE_EXPLORATION_STATE="UPDATE_EXPLORATION_STATE",
    UPDATE_EXPLORATION_PARAMS="UPDATE_EXPLORATION_PARAMS",
    UPDATE_EXPLORATION_DATA="UPDATE_EXPLORATION_DATA"
}

export class ExplorationTypedActions {
    private static readonly userDomain = "USER";
    private static readonly personDomain = "PERSON";
    private static readonly jurPersonDomain = "JUR_PERSON";
    private static readonly delimiter = "@";

    public static readonly user: ExplorationTypedActions = new ExplorationTypedActions(ExplorationTypedActions.userDomain);
    public static readonly person: ExplorationTypedActions = new ExplorationTypedActions(ExplorationTypedActions.personDomain);
    public static readonly jurPerson: ExplorationTypedActions = new ExplorationTypedActions(ExplorationTypedActions.jurPersonDomain);


    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_STATE]: string;
    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS]: string;
    public readonly [ExplorationCoreAction.UPDATE_EXPLORATION_DATA]: string;

    private static getTypedAction(core: ExplorationCoreAction, delimiter: string, type: string) {
        return core+delimiter+type;
    }

    private constructor(domain: string) {
        const UPDATE_STATE_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_STATE;
        this[UPDATE_STATE_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_STATE_CORE, ExplorationTypedActions.delimiter, domain);

        const UPDATE_PARAMS_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS;
        this[UPDATE_PARAMS_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_PARAMS_CORE, ExplorationTypedActions.delimiter, domain);

        const UPDATE_DATA_CORE = ExplorationCoreAction.UPDATE_EXPLORATION_DATA;
        this[UPDATE_DATA_CORE] = ExplorationTypedActions.getTypedAction(UPDATE_DATA_CORE, ExplorationTypedActions.delimiter, domain);
    }

}

/**
 * E - entity
 * P -params
 */
class ExplorationStateManager <E, P extends EntityExplorationParams> {
    private readonly dispatch;

    private readonly actions: ExplorationTypedActions;

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

}

export default ExplorationStateManager;