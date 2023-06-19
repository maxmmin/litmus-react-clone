import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import CreationTypedActions from "../actions/CreationTypedActions";
import TypedActionsUtil from "../../util/TypedActionsUtil";
import {combineReducers} from "redux";
import EntityCreationState, {BasicEntityCreationState} from "../types/creation/EntityCreationState";
import deepCopy from "../../util/deepCopy";
import CreationCoreAction, {
    initialJurPersonCreationParams,
    initialPersonCreationParams, initialUserCreationParams,
    PersonCreationAction
} from "../actions/CreationCoreAction";
import Person, {Relationship, RelationshipsLinkObject} from "../../model/human/person/Person";
import GeneralAction from "../GeneralAction";
import {Entity} from "../../model/Entity";
import PassportData from "../../model/human/person/PassportData";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import User from "../../model/human/user/User";


const entityCreationReducer = <S extends EntityCreationState<unknown>> (prevState: S, action: PayloadAction<unknown, string>): S => {
    switch (action.type) {

        case CreationCoreAction.UPDATE_ENTITY_CREATION_PARAMS: {
            const params: Partial<S["params"]> = action.payload as Partial<S["params"]>;
            return {...prevState, params: {...prevState.params!, ...params}}
        }

        case CreationCoreAction.SET_ENTITY_CREATION_PARAMS: {
            const params: Partial<S["params"]> = action.payload as Partial<S["params"]>;
            return {...prevState, params: {...params}};
        }

        default: {
            return prevState;
        }
    }
}

const initialPersonCreationState: EntityCreationState<Person> = deepCopy( new BasicEntityCreationState(initialPersonCreationParams));

const personCreationStateReducer: Reducer<EntityCreationState<
    Person>|undefined, PayloadAction<Person>> = (prevState=initialPersonCreationState, action) => {
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
            return {...prevState, params: {...prevState.params, passportData: passportData}}
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
const initialJurPersonState: EntityCreationState<JurPerson> = deepCopy(new BasicEntityCreationState(initialJurPersonCreationParams))

const jurPersonCreationStateReducer: Reducer<EntityCreationState<JurPerson>|undefined, PayloadAction<JurPerson>> = (prevState=initialJurPersonState, action) => {
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

const initialUserCreationState: EntityCreationState<User> = deepCopy(new BasicEntityCreationState(initialUserCreationParams));

const userCreationStateReducer: Reducer<EntityCreationState<User>|undefined, PayloadAction<User>> = (prevState=initialUserCreationState, action) => {
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

export const setEmergingEntityAction = "SET_CREATING_ENTITY"
const initialEntity = Entity.PERSON;

const emergingEntityReducer:  Reducer<Entity|undefined, PayloadAction<Entity>> = (prevState=initialEntity, action) => {
    if (action.type===setEmergingEntityAction) {
        return action.payload;
    } else {
        return prevState;
    }
}

const CreationStateReducer = combineReducers({
    user: userCreationStateReducer,
    person: personCreationStateReducer,
    jurPerson: jurPersonCreationStateReducer,
    emergingEntity: emergingEntityReducer
})

export default CreationStateReducer;