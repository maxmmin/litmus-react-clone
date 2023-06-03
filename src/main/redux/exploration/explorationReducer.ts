import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import {PersonExplorationParams, PersonExplorationState} from "./person/PersonExploration";
import {
    BasicEntityExplorationData,
    Entity,
    EntityExplorationData,
    EntityExplorationState
} from "./EntityExplorationState";
import Person from "../../model/person/Person";
import {ExplorationCoreAction, ExplorationTypedActions} from "./ExplorationActions";
import {JurPersonExplorationParams, JurPersonExplorationState} from "./jurPerson/JurPersonExploration";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {UserExplorationParams, UserExplorationState} from "./user/UserExploration";
import User from "../../model/user/User";
import {combineReducers} from "redux";

const initialPersonExplorationState = new PersonExplorationState(new BasicEntityExplorationData(), new PersonExplorationParams());

type PersonExplorationStateReducible = PersonExplorationState | undefined;


const entityExplorationReducer = <S extends EntityExplorationState<any, any>> (prevState: S, action: PayloadAction<any>): S => {
    switch (action.type) {
        case ExplorationCoreAction.UPDATE_EXPLORATION_STATE: {
            return action.payload as S;
        }
        case ExplorationCoreAction.UPDATE_EXPLORATION_DATA: {
            const newData = action.payload as S["data"];
            return {...prevState, data: newData};
        }
        case ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS: {
            const params = action.payload as S["params"];
            return {...prevState, params: params};
        }

        case ExplorationCoreAction.UPDATE_EXPLORATION_DATA_PENDING: {
            const bool: boolean = action.payload as boolean;
            return {...prevState, data: {...prevState.data, isPending: bool}}
        }

        case ExplorationCoreAction.UPDATE_EXPLORATION_DATA_RESULTS: {
            let results: S["data"]['results'] = action.payload;
            return {...prevState, data: {...prevState.data, results: results}}
        }

        default: {
            return prevState;
        }
    }
}

const personExplorationReducer: Reducer<PersonExplorationStateReducible, PayloadAction<any>> = (prevState=initialPersonExplorationState, action) => {
    const actions = ExplorationTypedActions.person;
    switch (action.type) {
        // code-place for person specific actions
        default: {
            const coreAction: PayloadAction<any> = {...action, type: ExplorationTypedActions.getCoreAction(action.type)}
            return entityExplorationReducer(prevState, coreAction);
        }
    }
}


const initialJurPersonExplorationState = new JurPersonExplorationState(new BasicEntityExplorationData(), new JurPersonExplorationParams());

type JurPersonExplorationStateReducible = JurPersonExplorationState | undefined;

const jurPersonExplorationReducer: Reducer<JurPersonExplorationStateReducible, PayloadAction<any>> = (prevState=initialJurPersonExplorationState, action) => {
    const actions = ExplorationTypedActions.jurPerson;
    switch (action.type) {
        // code-place for jur person specific actions
            // @todo write getClear action
        default: {
            const coreAction: PayloadAction<any> = {...action, type: ExplorationTypedActions.getCoreAction(action.type)}
            return entityExplorationReducer(prevState, coreAction);
        }
    }
}

const initialUserExplorationState = new UserExplorationState(new BasicEntityExplorationData(), new UserExplorationParams());

type UserExplorationStateReducible = UserExplorationState | undefined;

const userExplorationReducer: Reducer<UserExplorationStateReducible, PayloadAction<any>> = (prevState= initialUserExplorationState, action) => {
    const actions = ExplorationTypedActions.user;
    switch (action.type) {
        default: {
            const coreAction: PayloadAction<any> = {...action, type: ExplorationTypedActions.getCoreAction(action.type)}
            return entityExplorationReducer(prevState, coreAction);
        }
    }
}

const initialEntity = Entity.PERSON;

export const setExploredEntityAction = "SET_EXPLORED_ENTITY"

const exploredEntityReducer:  Reducer<Entity|undefined, PayloadAction<Entity>> = (prevState=initialEntity, action) => {
    if (action.type===setExploredEntityAction) {
        return action.payload;
    }
}

const explorationReducer = combineReducers({
    person: personExplorationReducer,
    jurPerson: jurPersonExplorationReducer,
    user: userExplorationReducer,
    exploredEntity: exploredEntityReducer
})

export default explorationReducer;