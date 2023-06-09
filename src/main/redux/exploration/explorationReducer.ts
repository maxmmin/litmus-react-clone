import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import EntityExplorationState from "./EntityExplorationState";
import {ExplorationCoreAction, ExplorationTypedActions} from "./ExplorationActions";
import {combineReducers} from "redux";
import PersonExplorationState from "./human/person/PersonExplorationState";
import PersonExplorationParams from "./human/person/PersonExplorationParams";
import JurPersonExplorationState from "./jurPerson/JurPersonExplorationState";
import JurPersonExplorationParams from "./jurPerson/JurPersonExplorationParams";
import UserExplorationState from "./human/user/UserExplorationState";
import UserExplorationParams from "./human/user/UserExplorationParams";
import {Entity} from "./Entity";
import EntityExplorationParams from "./EntityExplorationParams";
import ExplorationMode from "./ExplorationMode";
import deepCopy from "../../util/pureFunctions";

const entityExplorationReducer = <E,S extends EntityExplorationState<E, EntityExplorationParams>> (prevState: S, action: PayloadAction<any>): S => {
    switch (action.type) {
        case ExplorationCoreAction.UPDATE_EXPLORATION_STATE: {
            return deepCopy(action.payload as S);
        }
        case ExplorationCoreAction.UPDATE_EXPLORATION_DATA: {
            const newData = action.payload as S["data"];
            return {...prevState, data: {...newData}};
        }
        case ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS: {
            let params = action.payload as S["params"];
            params = deepCopy(params)
            return {...prevState, params};
        }

        case ExplorationCoreAction.UPDATE_EXPLORATION_DATA_PENDING: {
            const bool: boolean = action.payload as boolean;
            return {...prevState, data: {...prevState.data, isPending: bool}}
        }

        case ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS_MODE: {
            const selectedMode = action.payload as ExplorationMode;
            const modeId = selectedMode.id;
            if (!prevState.params.supportedModesIdList.includes(modeId)) {
                throw new Error("unsupported mode was provided")
            }
            return {...prevState, params: {...prevState.params, modeId: selectedMode}}
        }

        default: {
            return prevState;
        }
    }
}

const initialPersonExplorationState = deepCopy(new PersonExplorationState(new PersonExplorationParams()));

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


const initialJurPersonExplorationState = deepCopy(new JurPersonExplorationState(new JurPersonExplorationParams()))

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

const initialUserExplorationState = deepCopy(new UserExplorationState( new UserExplorationParams()));

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