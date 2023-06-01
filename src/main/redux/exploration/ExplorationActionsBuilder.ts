import {JurPerson} from "../../model/jurPerson/JurPerson";
import {Entity, EntityExplorationData, EntityExplorationParams, EntityExplorationState} from "./EntityExplorationState";
import Person from "../../model/person/Person";
import User from "../../model/user/User";
import {JurPersonExplorationParams} from "./JurPersonExploration";
import {PersonExplorationParams} from "./PersonExploration";
import {UserExplorationParams} from "./UserExploration";
import {PayloadAction} from "@reduxjs/toolkit";

enum ExplorationAction{
    UPDATE_EXPLORATION_STATE="UPDATE_EXPLORATION_PARAMS",
    UPDATE_EXPLORATION_PARAMS="UPDATE_EXPLORATION_PARAMS",
    UPDATE_EXPLORATION_DATA="UPDATE_EXPLORATION_DATA"
}

/**
 * E - entity
 * P -params
 */
class ExplorationActionsBuilder <E, P extends EntityExplorationParams> {
    private readonly actionBase: string;

    public readonly delimiter: string = "@";

    constructor(actionBase: string, delimiter?: string) {
        this.actionBase = actionBase;
        if (delimiter) {
            this.delimiter = delimiter
        }
    }

    private getRipeActionType(rawType: ExplorationAction) {
        return this.actionBase+this.delimiter+rawType
    }

    static actionCreator (entityType: Entity) {
        switch (entityType) {
            case Entity.JUR_PERSONS: {
                return new ExplorationActionsBuilder<JurPerson, JurPersonExplorationParams>(Entity.JUR_PERSONS);
            }

            case Entity.PERSONS: {
                return new ExplorationActionsBuilder<Person, PersonExplorationParams>(Entity.PERSONS);
            }

            case Entity.USERS: {
                return new ExplorationActionsBuilder<User, UserExplorationParams>(Entity.USERS)
            }

            default: throw new Error("provided unknown entity type")
        }
    }

    updateStateAction (state: EntityExplorationState<E, P>): PayloadAction<EntityExplorationState<E, P>> {
        return {
            type: this.getRipeActionType(ExplorationAction.UPDATE_EXPLORATION_STATE),
            payload: state
        }
    }

    updateParamsAction (params: P): PayloadAction<P> {
        return {
            type: this.getRipeActionType(ExplorationAction.UPDATE_EXPLORATION_PARAMS),
            payload: params
        }
    }

    updateDataAction (data: EntityExplorationData<E>): PayloadAction<EntityExplorationData<E>> {
        return {
            type: this.getRipeActionType(ExplorationAction.UPDATE_EXPLORATION_DATA),
            payload: data
        }
    }
}