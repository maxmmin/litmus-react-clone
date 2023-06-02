import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import {PersonExplorationParams, PersonExplorationState} from "./person/PersonExploration";
import {BasicEntityExplorationData, Entity, EntityExplorationData, ExplorationMode} from "./EntityExplorationState";
import Person from "../../model/person/Person";
import {ExplorationTypedActions} from "./ExplorationActions";
import {JurPersonExplorationParams, JurPersonExplorationState} from "./jurPerson/JurPersonExploration";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {UserExplorationParams, UserExplorationState} from "./user/UserExploration";
import User from "../../model/user/User";
import {combineReducers} from "redux";

const initialPersonExplorationState = new PersonExplorationState(new BasicEntityExplorationData(), new PersonExplorationParams());

type PersonExplorationStateReducible = PersonExplorationState | undefined;

const personExplorationReducer: Reducer<PersonExplorationStateReducible, PayloadAction<any>> = (prevState=initialPersonExplorationState, action) => {
    const actions = ExplorationTypedActions.person;
    switch (action.type) {
        case actions.UPDATE_EXPLORATION_STATE: {
            return action.payload as PersonExplorationState;
        }
        case actions.UPDATE_EXPLORATION_DATA: {
            const newData = action.payload as EntityExplorationData<Person>;
            return {...prevState, data: newData};
        }
        case actions.UPDATE_EXPLORATION_PARAMS: {
            const params = action.payload as PersonExplorationParams;
            return {...prevState, params: params};
        }
        default: {
            return prevState;
        }
    }
}


const initialJurPersonExplorationState = new JurPersonExplorationState(new BasicEntityExplorationData(), new JurPersonExplorationParams());

type JurPersonExplorationStateReducible = JurPersonExplorationState | undefined;

const jurPersonExplorationReducer: Reducer<JurPersonExplorationStateReducible, PayloadAction<any>> = (prevState=initialJurPersonExplorationState, action) => {
    const actions = ExplorationTypedActions.jurPerson;
    switch (action.type) {
        case actions.UPDATE_EXPLORATION_STATE: {
            return action.payload as JurPersonExplorationState;
        }
        case actions.UPDATE_EXPLORATION_DATA: {
            const newData = action.payload as EntityExplorationData<JurPerson>;
            return {...prevState, data: newData};
        }
        case actions.UPDATE_EXPLORATION_PARAMS: {
            const params = action.payload as JurPersonExplorationParams;
            return {...prevState, params: params};
        }
        default: {
            return prevState;
        }
    }
}

const initialUserExplorationState = new UserExplorationState(new BasicEntityExplorationData(), new UserExplorationParams());

type UserExplorationStateReducible = UserExplorationState | undefined;

const userExplorationReducer: Reducer<UserExplorationStateReducible, PayloadAction<any>> = (prevState= initialUserExplorationState, action) => {
    const actions = ExplorationTypedActions.user;
    switch (action.type) {
        case actions.UPDATE_EXPLORATION_STATE: {
            return action.payload as UserExplorationState;
        }
        case actions.UPDATE_EXPLORATION_DATA: {
            const newData = action.payload as EntityExplorationData<User>;
            return {...prevState, data: newData};
        }
        case actions.UPDATE_EXPLORATION_PARAMS: {
            const params = action.payload as UserExplorationParams;
            return {...prevState, params: params};
        }

        default: {
            return prevState;
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