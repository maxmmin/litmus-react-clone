import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import CreationTypedActions from "../actions/CreationTypedActions";
import TypedActionsUtil from "../../util/TypedActionsUtil";
import {combineReducers} from "redux";
import EntityCreationState, {BasicEntityCreationState} from "../types/creation/EntityCreationState";
import deepCopy from "../../util/deepCopy";
import CreationCoreActions, {
    initialJurPersonCreationParams,
    initialPersonCreationParams, initialUserCreationParams,
    JurPersonCreationParams, PersonCreationAction,
    PersonCreationParams, UserCreationParams
} from "../actions/CreationCoreActions";
import JurPersonCreationStateManagerImpl from "../../service/creation/stateManager/jurPerson/JurPersonCreationStateManagerImpl";
import {Relationship, RelationshipsLinkObject} from "../../model/human/person/Person";
import {PassportData} from "../../model/human/person/PassportData";
import AuthAction from "../actions/AuthAction";
import GeneralAction from "../GeneralAction";


const entityCreationReducer = <S extends EntityCreationState<unknown>> (prevState: S, action: PayloadAction<unknown, string>): S => {
    switch (action.type) {

        case CreationCoreActions.UPDATE_ENTITY_CREATION_PARAMS: {
            const params: Partial<S> = action.payload as Partial<S>;
            return {...prevState, ...params}
        }

        case CreationCoreActions.SET_ENTITY_CREATION_PARAMS: {
            return action.payload as S;
        }

        default: {
            return prevState;
        }
    }
}

const initialPersonCreationState: EntityCreationState<PersonCreationParams> = deepCopy( new BasicEntityCreationState(initialPersonCreationParams));

const personCreationStateReducer: Reducer<EntityCreationState<PersonCreationParams>|undefined, PayloadAction<PersonCreationParams>> = (prevState=initialPersonCreationState, action) => {
    switch (action.type) {
        case PersonCreationAction.ADD_PERSON_RELATION: {
            const relToAdd = (action.payload as unknown as Relationship);

            const relationshipsLinkObject = new RelationshipsLinkObject(prevState.params.relationships);
            relationshipsLinkObject.addRelationship(relToAdd);

            return {...prevState, params: {...prevState.params, relationships: relationshipsLinkObject.relationships}}
        }

        case PersonCreationAction.REMOVE_PERSON_RELATION: {
            const relToAdd = (action.payload as unknown as Relationship);

            const relationshipsLinkObject = new RelationshipsLinkObject(prevState.params.relationships);
            relationshipsLinkObject.removeRelationship(relToAdd);

            return {...prevState, params: {...prevState.params, relationships: relationshipsLinkObject.relationships}}
        }

        case PersonCreationAction.UPDATE_PERSON_RELATION: {
            const relToUpdate = (action.payload as unknown as Relationship);

            const relationshipsLinkObject = new RelationshipsLinkObject(prevState.params.relationships);
            relationshipsLinkObject.updateRelationship(relToUpdate);

            return {...prevState, params: {...prevState.params, relationships: relationshipsLinkObject.relationships}}
        }

        case PersonCreationAction.UPDATE_PASSPORT_DATA: {
            const payload = action.payload as unknown as Partial<PassportData>;

            let passportData: PassportData = Object.assign({},prevState.params.passportData, payload);
            return {...prevState, params: {...prevState.params, passportData}}
        }

        case GeneralAction.RESET_DATA: {
            return initialPersonCreationState;
        }

        default: {
            const parsedAction = TypedActionsUtil.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===TypedActionsUtil.personDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityCreationReducer(prevState, coreAction);
            } else {
                return prevState;
            }
        }
    }
}
const initialJurPersonState: EntityCreationState<JurPersonCreationParams> = deepCopy(new BasicEntityCreationState(initialJurPersonCreationParams))

const jurPersonCreationStateReducer: Reducer<EntityCreationState<JurPersonCreationParams>|undefined, PayloadAction<JurPersonCreationParams>> = (prevState=initialJurPersonState, action) => {
    const actions = CreationTypedActions.person;
    switch (action.type) {
        // code-place for jur person specific actions
        // @todo write getClear action

        case GeneralAction.RESET_DATA: {
            return initialJurPersonState
        }

        default: {
            const parsedAction = TypedActionsUtil.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===TypedActionsUtil.jurPersonDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityCreationReducer(prevState, coreAction);
            } else {
                return prevState;
            }
        }
    }
}

const initialUserCreationState: EntityCreationState<UserCreationParams> = deepCopy(new BasicEntityCreationState(initialUserCreationParams));

const userCreationStateReducer: Reducer<EntityCreationState<UserCreationParams>|undefined, PayloadAction<UserCreationParams>> = (prevState=initialUserCreationState, action) => {
    const actions = CreationTypedActions.person;
    switch (action.type) {
        case GeneralAction.RESET_DATA: {
            return initialUserCreationState
        }

        default: {
            const parsedAction = TypedActionsUtil.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===TypedActionsUtil.userDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityCreationReducer(prevState, coreAction);
            } else {
                return prevState;
            }
        }
    }
}

const CreationStateReducer = combineReducers({
    user: userCreationStateReducer,
    person: personCreationStateReducer,
    jurPerson: jurPersonCreationStateReducer
})

export default CreationStateReducer;