import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import EntityExplorationState from "../types/exploration/EntityExplorationState";
import {combineReducers} from "redux";
import PersonExplorationState, {
    BasicPersonExplorationState
} from "../types/exploration/human/person/PersonExplorationState";
import PersonExplorationParams, {
    BasicPersonExplorationParams
} from "../types/exploration/human/person/PersonExplorationParams";
import JurPersonExplorationState, {BasicJurPersonExplorationState} from "../types/exploration/jurPerson/JurPersonExplorationState";
import BasicJurPersonExplorationParams from "../types/exploration/jurPerson/BasicJurPersonExplorationParams";
import UserExplorationState, {BasicUserExplorationState} from "../types/exploration/human/user/UserExplorationState";
import {BasicUserExplorationParams} from "../types/exploration/human/user/UserExplorationParams";
import {Entity} from "../../model/Entity";
import EntityExplorationParams from "../types/exploration/EntityExplorationParams";
import TypedActionsUtil from "../../util/TypedActionsUtil";
import deepCopy from "../../util/deepCopy";
import GeneralAction from "../GeneralAction";
import {ExplorationTypedAction} from "../actions/ExplorationTypedAction";
import {ExplorationCoreAction} from "../actions/ExplorationActions";

const entityExplorationReducer = <S extends EntityExplorationState<any, EntityExplorationParams>> (prevState: S, action: PayloadAction<unknown, string>): S => {
    switch (action.type) {
        case ExplorationCoreAction.SET_EXPLORATION_STATE: {
            return action.payload as S;
        }

        case ExplorationCoreAction.SET_EXPLORATION_DATA: {
            const newData = action.payload as S["data"];
            return {...prevState, data: newData};
        }

        case `${ExplorationCoreAction.RETRIEVE_DATA}/fulfilled`: {
            const newData = action.payload as S["data"];
            return {...prevState, data: newData, isPending: false};
        }

        case `${ExplorationCoreAction.RETRIEVE_DATA}/pending`: {
            return {...prevState, isPending: true}
        }

        case `${ExplorationCoreAction.RETRIEVE_DATA}/rejected`: {
            return {...prevState, data: null, isPending: false};
        }

        case ExplorationCoreAction.SET_EXPLORATION_PARAMS: {
            let params = action.payload as S["params"];
            return {...prevState, params};
        }

        case ExplorationCoreAction.UPDATE_EXPLORATION_PARAMS: {
            let params = action.payload as Partial<S["params"]>
            return {...prevState, params: {...prevState.params, ...params}}
        }

        case ExplorationCoreAction.SET_EXPLORATION_VALIDATION_ERRORS: {
            return {...prevState, validationErrors: action.payload}
        }

        case ExplorationCoreAction.UPDATE_EXPLORATION_VALIDATION_ERRORS: {
            return {...prevState, validationErrors: {...prevState.validationErrors, ...(action.payload as object)}}
        }

        case ExplorationCoreAction.SET_EXPLORATION_STATE_PENDING: {
            const bool: boolean = action.payload as boolean;
            return {...prevState, isPending: bool} as S;
        }

        case ExplorationCoreAction.SET_EXPLORATION_PARAMS_MODE: {
            const modeId = action.payload as number;
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

const initialPersonExplorationState = deepCopy(new BasicPersonExplorationState());

type PersonExplorationStateReducible = PersonExplorationState | undefined;

const personExplorationReducer: Reducer<PersonExplorationStateReducible, PayloadAction<unknown>> = (prevState=initialPersonExplorationState, action) => {
    const actions = ExplorationTypedAction.person;
    switch (action.type) {
        // code-place for jur person specific actions
        // @todo write getClear action
        case GeneralAction.RESET_DATA: {
            return initialPersonExplorationState;
        }

        default: {
            const parsedAction = TypedActionsUtil.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===TypedActionsUtil.personDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityExplorationReducer(prevState, coreAction);
            } else {
                return prevState;
            }
        }
    }
}


const initialJurPersonExplorationState = deepCopy(new BasicJurPersonExplorationState())

type JurPersonExplorationStateReducible = JurPersonExplorationState | undefined;

const jurPersonExplorationReducer: Reducer<JurPersonExplorationStateReducible, PayloadAction<unknown>> = (prevState=initialJurPersonExplorationState, action) => {
    switch (action.type) {
        // code-place for jur person specific actions
        case GeneralAction.RESET_DATA: {
            return initialJurPersonExplorationState
        }

        default: {
            const parsedAction = TypedActionsUtil.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===TypedActionsUtil.jurPersonDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityExplorationReducer(prevState, coreAction);
            } else {
                return prevState;
            }
        }
    }
}

const initialUserExplorationState = deepCopy(new BasicUserExplorationState());

type UserExplorationStateReducible = UserExplorationState | undefined;

const userExplorationReducer: Reducer<UserExplorationStateReducible, PayloadAction<unknown>> = (prevState= initialUserExplorationState, action) => {
    const actions = ExplorationTypedAction.user;
    switch (action.type) {
        // code-place for jur person specific actions
        // @todo write getClear action

        case GeneralAction.RESET_DATA: {
            return initialUserExplorationState
        }

        default: {
            const parsedAction = TypedActionsUtil.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===TypedActionsUtil.userDomain) {
                const coreAction: PayloadAction<unknown> = {...action, type: parsedAction.core}
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

const explorationStateReducer = combineReducers({
    person: personExplorationReducer,
    jurPerson: jurPersonExplorationReducer,
    user: userExplorationReducer,
    exploredEntity: exploredEntityReducer
})

export default explorationStateReducer;