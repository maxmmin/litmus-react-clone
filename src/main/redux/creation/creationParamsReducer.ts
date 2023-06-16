import {Reducer} from "react";
import CreationCoreActions, {
    CreationParams,
    JurPersonCreationParams,
    PersonCreationParams,
    UserCreationParams
} from "./CreationCoreActions";
import {PayloadAction} from "@reduxjs/toolkit";
import {Entity} from "../../model/Entity";
import CreationTypedActions from "./CreationTypedActions";
import TypedActionsUtil from "../../util/TypedActionsUtil";
import {combineReducers} from "redux";


const entityCreationReducer = <S> (prevState: S, action: PayloadAction<unknown, string>): S => {
    switch (action.type) {

        case CreationCoreActions.UPDATE_ENTITY_CREATION_PARAMS: {
            const params: Partial<S> = action.payload as Partial<S>;
            return {...prevState, ...params}
        }

        case CreationCoreActions.SET_ENTITY_CREATION_PARAMS: {
            return action.payload as S;
        }

        // /**
        //  *  jur person specified
        //  */
        // case CreationCoreActions.UPDATE_JUR_PERSON_CREATION_DATA: {
        //     return {...prevState, jurPersonCreationData: {...prevState.jurPersonCreationData, ...(action.payload as unknown as Partial<JurPerson>)}}
        // }
        //
        //
        // /**
        //  *  person specified
        //  */
        // case CreationCoreActions.UPDATE_PERSON_CREATION_DATA: {
        //     return {...prevState, personCreationData: {...prevState.personCreationData, ...(action.payload as unknown as Partial<Person>)}}
        // }
        //
        // case CreationCoreActions.UPDATE_PERSON_SEX: {
        //     return {...prevState, personCreationData: {...prevState.personCreationData, sex: action.payload as unknown as Sex}}
        // }
        //
        // case CreationCoreActions.ADD_PERSON_RELATION: {
        //     const relToAdd = (action.payload as unknown as Relationship);
        //
        //     const relationshipsLinkObject = new RelationshipsLinkObject(prevState.personCreationData.relationships);
        //     relationshipsLinkObject.addRelationship(relToAdd);
        //
        //     return {...prevState, personCreationData: {...prevState.personCreationData, relationships: relationshipsLinkObject.relationships}}
        // }
        //
        // case CreationCoreActions.REMOVE_PERSON_RELATION: {
        //     const relToAdd = (action.payload as unknown as Relationship);
        //
        //     const relationshipsLinkObject = new RelationshipsLinkObject(prevState.personCreationData.relationships);
        //     relationshipsLinkObject.removeRelationship(relToAdd);
        //
        //     return {...prevState, personCreationData: {...prevState.personCreationData, relationships: relationshipsLinkObject.relationships}}
        // }
        //
        // case CreationCoreActions.UPDATE_PERSON_RELATION: {
        //     const relToUpdate = (action.payload as unknown as Relationship);
        //
        //     const relationshipsLinkObject = new RelationshipsLinkObject(prevState.personCreationData.relationships);
        //     relationshipsLinkObject.updateRelationship(relToUpdate);
        //
        //     return {...prevState, personCreationData: {...prevState.personCreationData, relationships: relationshipsLinkObject.relationships}}
        // }
        //
        // case CreationCoreActions.UPDATE_PASSPORT_DATA: {
        //     const payload = action.payload as unknown as Partial<PassportData>;
        //
        //     let passportData: PassportData = Object.assign({},prevState.personCreationData.passportData, payload);
        //     return {...prevState, personCreationData: {...prevState.personCreationData, passportData}}
        // }
        //
        // /**
        //  *  user specified
        //  */
        //
        // case CreationCoreActions.UPDATE_USER_CREATION_DATA: {
        //     return {...prevState, userCreationData: {...prevState.userCreationData, ...(action.payload as unknown as Partial<User>)}}
        // }
        //
        // /**
        //  *  non-business-logic
        //  */
        // case AuthActions.CLEAR_AUTH: {
        //     return initialState
        // }
        //
        // case CreationCoreActions.SET_CREATION_PENDING: {
        //     const act = action as unknown as PayloadAction<boolean>
        //     return {...prevState, pending: act.payload}
        // }

        default: {
            return prevState;
        }
    }
}

export type PersonCreationParamsReducible = PersonCreationParams|undefined;

const initialPersonCreationParams = {...new PersonCreationParams()}

const personCreationParamsReducer: Reducer<PersonCreationParamsReducible, PayloadAction<PersonCreationParams>> = (prevState=initialPersonCreationParams, action) => {
    const actions = CreationTypedActions.person;
    switch (action.type) {
        // code-place for jur person specific actions
        // @todo write getClear action
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

export type JurPersonCreationParamsReducible = JurPersonCreationParams|undefined;

const initialJurPersonCreationParams = {...new JurPersonCreationParams()}

const jurPersonCreationParamsReducer: Reducer<JurPersonCreationParamsReducible, PayloadAction<PersonCreationParams>> = (prevState=initialJurPersonCreationParams, action) => {
    const actions = CreationTypedActions.person;
    switch (action.type) {
        // code-place for jur person specific actions
        // @todo write getClear action
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

export type UserCreationParamsReducible = UserCreationParams|undefined;

const initialUserCreationParams = {...new UserCreationParams()}

const userCreationParamsReducer: Reducer<UserCreationParamsReducible, PayloadAction<PersonCreationParams>> = (prevState=initialUserCreationParams, action) => {
    const actions = CreationTypedActions.person;
    switch (action.type) {

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

const creationParamsReducer = combineReducers({
    user: userCreationParamsReducer,
    person: personCreationParamsReducer,
    jurPerson: jurPersonCreationParamsReducer
})

export default creationParamsReducer;