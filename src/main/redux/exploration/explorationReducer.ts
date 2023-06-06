import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import EntityExplorationState from "./EntityExplorationState";
import {ExplorationCoreAction, ExplorationTypedActions} from "./ExplorationActions";
import {combineReducers} from "redux";
import PersonExplorationState from "./person/PersonExplorationState";
import PersonExplorationParams from "./person/PersonExplorationParams";
import JurPersonExplorationState from "./jurPerson/JurPersonExplorationState";
import JurPersonExplorationParams from "./jurPerson/JurPersonExplorationParams";
import UserExplorationState from "./user/UserExplorationState";
import UserExplorationParams from "./user/UserExplorationParams";
import BasicEntityExplorationData from "./BasicEntityExplorationData";
import {Entity} from "./Entity";
import EntityExplorationParams from "./EntityExplorationParams";
import ExplorationMode from "./ExplorationMode";
import User from "../../model/user/User";
import EntityExplorationData from "./EntityExplorationData";

const getSerializableState = <S extends EntityExplorationState<any, EntityExplorationParams>> (state: S): S => {
    let serializableState = {...state};
    serializableState.data = state.data?{...state.data}:null;
    serializableState.params = {...state.params}
    return serializableState;
}

const entityExplorationReducer = <E,S extends EntityExplorationState<E, EntityExplorationParams>> (prevState: S, action: PayloadAction<any>): S => {
    switch (action.type) {
        case ExplorationCoreAction.UPDATE_EXPLORATION_STATE: {
            return getSerializableState(action.payload as S);
        }
        case ExplorationCoreAction.UPDATE_EXPLORATION_DATA: {
            const newData = action.payload as S["data"];
            return {...prevState, data: {...newData}};
        }
        case ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS: {
            const params = action.payload as S["params"];
            return {...prevState, params: {...params}};
        }

        case ExplorationCoreAction.UPDATE_EXPLORATION_DATA_PENDING: {
            const bool: boolean = action.payload as boolean;
            return {...prevState, data: {...prevState.data, isPending: bool}}
        }

        case ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS_MODE: {
            const selectedMode = action.payload as ExplorationMode;
            if (!prevState.params.supportedModes.includes(selectedMode)) {
                throw new Error("unsupported mode was provided")
            }
            return {...prevState, params: {...prevState.params, mode: selectedMode}}
        }

        default: {
            return prevState;
        }
    }
}

const initialPersonExplorationState = getSerializableState(new PersonExplorationState(new PersonExplorationParams()));

type PersonExplorationStateReducible = PersonExplorationState | undefined;

const personExplorationReducer: Reducer<PersonExplorationStateReducible, PayloadAction<any>> = (prevState=initialPersonExplorationState, action) => {
    const actions = ExplorationTypedActions.person;
    switch (action.type) {
        // code-place for jur person specific actions
        // @todo write getClear action
        default: {
            const [coreType, domain] = ExplorationTypedActions.parseAction(action.type);
            if (domain===ExplorationTypedActions.personDomain) {
                const coreAction: PayloadAction<any> = {...action, type: coreType}
                return entityExplorationReducer(prevState, coreAction);
            }
            else return prevState;
        }
    }
}


const initialJurPersonExplorationState = getSerializableState(new JurPersonExplorationState(new JurPersonExplorationParams()))

type JurPersonExplorationStateReducible = JurPersonExplorationState | undefined;

const jurPersonExplorationReducer: Reducer<JurPersonExplorationStateReducible, PayloadAction<any>> = (prevState=initialJurPersonExplorationState, action) => {
    switch (action.type) {
        // code-place for jur person specific actions
            // @todo write getClear action
        default: {
            const [coreType, domain] = ExplorationTypedActions.parseAction(action.type);
            if (domain===ExplorationTypedActions.jurPersonDomain) {
                const coreAction: PayloadAction<any> = {...action, type: coreType}
                return entityExplorationReducer(prevState, coreAction);
            }
            else return prevState;
        }
    }
}

const initialUserExplorationState = getSerializableState(new UserExplorationState( new UserExplorationParams()));

type UserExplorationStateReducible = UserExplorationState | undefined;

const userExplorationReducer: Reducer<UserExplorationStateReducible, PayloadAction<any>> = (prevState= initialUserExplorationState, action) => {
    const actions = ExplorationTypedActions.user;
    switch (action.type) {
        // code-place for jur person specific actions
        // @todo write getClear action
        default: {
            const [coreType, domain] = ExplorationTypedActions.parseAction(action.type);
            if (domain===ExplorationTypedActions.userDomain) {
                const coreAction: PayloadAction<any> = {...action, type: coreType}
                return entityExplorationReducer(prevState, coreAction);
            }
            else return prevState;
        }
    }
}

const initialEntity = Entity.PERSON;

export const setExploredEntityAction = "SET_EXPLORED_ENTITY"

const exploredEntityReducer:  Reducer<Entity|undefined, PayloadAction<Entity>> = (prevState=initialEntity, action) => {
    if (action.type===setExploredEntityAction) {
        return action.payload;
    } else {
        return prevState;
    }
}

const explorationReducer = combineReducers({
    person: personExplorationReducer,
    jurPerson: jurPersonExplorationReducer,
    user: userExplorationReducer,
    exploredEntity: exploredEntityReducer
})

export default explorationReducer;