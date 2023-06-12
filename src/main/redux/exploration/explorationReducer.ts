import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import EntityExplorationState from "./types/EntityExplorationState";
import {ExplorationCoreAction, ExplorationTypedActions} from "./ExplorationActions";
import {combineReducers} from "redux";
import PersonExplorationState from "./types/human/person/PersonExplorationState";
import PersonExplorationParams from "./types/human/person/PersonExplorationParams";
import JurPersonExplorationState from "./types/jurPerson/JurPersonExplorationState";
import JurPersonExplorationParams from "./types/jurPerson/JurPersonExplorationParams";
import UserExplorationState from "./types/human/user/UserExplorationState";
import UserExplorationParams from "./types/human/user/UserExplorationParams";
import {Entity} from "../../model/Entity";
import EntityExplorationParams from "./types/EntityExplorationParams";
import ExplorationMode from "./types/ExplorationMode";
import deepCopy from "../../util/pureFunctions";

const entityExplorationReducer = <S extends EntityExplorationState<any, EntityExplorationParams>> (prevState: S, action: PayloadAction<any>): S => {
    switch (action.type) {
        case ExplorationCoreAction.SET_EXPLORATION_STATE: {
            return action.payload as S;
        }
        case ExplorationCoreAction.SET_EXPLORATION_DATA: {
            const newData = action.payload as S["data"];
            return {...prevState, data: newData};
        }
        case ExplorationCoreAction.SET_EXPLORATION_PARAMS: {
            let params = action.payload as S["params"];
            return {...prevState, params};
        }

        case ExplorationCoreAction.SET_EXPLORATION_STATE_PENDING: {
            const bool: boolean = action.payload as boolean;
            return {...prevState, isPending: bool} as S;
        }

        case ExplorationCoreAction.SET_EXPLORATION_PARAMS_MODE: {
            const selectedMode = action.payload as ExplorationMode;
            const modeId = selectedMode.id;
            if (!prevState.params.supportedModesIdList.includes(modeId)) {
                throw new Error("unsupported mode was provided")
            }

            return {...prevState, params: {...prevState.params, modeId: modeId}}
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
            const parsedAction = ExplorationTypedActions.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===ExplorationTypedActions.personDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityExplorationReducer(prevState, coreAction);
            } else {
                return prevState;
            }
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
            const parsedAction = ExplorationTypedActions.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===ExplorationTypedActions.jurPersonDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityExplorationReducer(prevState, coreAction);
            } else {
                return prevState;
            }
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
            const parsedAction = ExplorationTypedActions.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===ExplorationTypedActions.userDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityExplorationReducer(prevState, coreAction);
            } else {
                return prevState;
            }
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