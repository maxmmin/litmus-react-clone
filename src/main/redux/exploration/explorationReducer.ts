import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import {PersonExplorationParams, PersonExplorationState} from "./PersonExploration";
import {BasicEntityExplorationData, EntityExplorationData, ExplorationMode} from "./EntityExplorationState";
import Person from "../../model/person/Person";
import {ExplorationTypedActions} from "./ExplorationActions";
import {JurPersonExplorationParams, JurPersonExplorationState} from "./JurPersonExploration";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {UserExplorationParams, UserExplorationState} from "./UserExploration";
import User from "../../model/user/User";
import {combineReducers} from "redux";

const initialPersonExplorationState = new PersonExplorationState(new BasicEntityExplorationData(), new PersonExplorationParams());

const personExplorationReducer: Reducer<PersonExplorationState, PayloadAction<any>> = (prevState=initialPersonExplorationState, action) => {
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

const jurPersonExplorationReducer: Reducer<JurPersonExplorationState, PayloadAction<any>> = (prevState=initialJurPersonExplorationState, action) => {
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

const userExplorationReducer: Reducer<UserExplorationState, PayloadAction<any>> = (prevState= initialUserExplorationState, action) => {
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

const explorationReducer = combineReducers({
    person: personExplorationReducer,
    jurPerson: jurPersonExplorationReducer,
    user: userExplorationReducer
})

export default explorationReducer;