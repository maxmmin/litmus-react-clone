import {Reducer} from "react";
import {PayloadAction} from "@reduxjs/toolkit";
import CreationTypedAction from "../actions/CreationTypedAction";
import TypedActionsUtil from "../../util/TypedActionsUtil";
import {combineReducers} from "redux";
import EntityCreationState from "../types/creation/EntityCreationState";
import serializableDeepCopy from "../../util/functional/serializableDeepCopy";
import CreationCoreAction, {
    PersonCreationAction
} from "../actions/CreationCoreAction";
import {Entity} from "../../model/Entity";
import PassportData from "../../model/human/person/PassportData";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import User from "../../model/human/user/User";
import UserCreationState, {BasicUserCreationState} from "../types/creation/UserCreationState";
import JurPersonCreationState, {BasicJurPersonCreationState} from "../types/creation/JurPersonCreationState";
import PersonCreationState, {BasicPersonCreationState} from "../types/creation/PersonCreationState";
import {ValidationErrors} from "../../model/ValidationErrors";
import {PersonCreationParams, RelationshipCreationParams} from "../../service/coreServices/creation/PersonCreationService";
import RelationshipsLinkObject from "../../util/person/RelationshipsLinkObject";


const entityCreationReducer = <S extends EntityCreationState<unknown>> (prevState: S, action: PayloadAction<unknown>, initialState: S): S => {
    switch (action.type) {

        case CreationCoreAction.UPDATE_ENTITY_CREATION_PARAMS: {
            const params: Partial<S["emergingEntity"]> = action.payload as Partial<S["emergingEntity"]>;
            return {...prevState, emergingEntity: {...prevState.emergingEntity!, ...params}}
        }

        case CreationCoreAction.SET_ENTITY_VALIDATION_ERRORS: {
            return {...prevState, validationErrors: action.payload}
        }

        case CreationCoreAction.UPDATE_ENTITY_VALIDATION_ERRORS: {
            return {...prevState, validationErrors: {...prevState.validationErrors, ...(action.payload as ValidationErrors<S["emergingEntity"]>)}}
        }

        case CreationCoreAction.SET_ENTITY_CREATION_PARAMS: {
            const params: Partial<S["emergingEntity"]> = action.payload as Partial<S["emergingEntity"]>;
            return {...prevState, emergingEntity: {...params}};
        }

        case `${CreationCoreAction.CREATE_ENTITY}/fulfilled`: {
            return initialState;
        }

        default: {
            return prevState;
        }
    }
}

const initialPersonCreationState: PersonCreationState = serializableDeepCopy(new BasicPersonCreationState());

export type PersonCreationStateReducible = PersonCreationState|undefined;


const personCreationStateReducer: Reducer<PersonCreationStateReducible, PayloadAction<PersonCreationParams>> = (prevState=initialPersonCreationState, action) => {
    switch (action.type) {
        case PersonCreationAction.ADD_PERSON_RELATION: {
            const relToAdd = (action.payload as unknown as RelationshipCreationParams);

            const relationshipsLinkObject = new RelationshipsLinkObject(prevState.emergingEntity.relationships);
            relationshipsLinkObject.addRelationship(relToAdd);

            const newPersonState: PersonCreationState =  {...prevState, emergingEntity: {...prevState.emergingEntity, relationships: relationshipsLinkObject.relationships,}}

            return newPersonState;
        }

        case PersonCreationAction.REMOVE_PERSON_RELATION: {
            const relToAdd = (action.payload as unknown as RelationshipCreationParams);

            const relationshipsLinkObject = new RelationshipsLinkObject(prevState.emergingEntity.relationships);
            relationshipsLinkObject.removeRelationship(relToAdd);

            return {...prevState, emergingEntity: {...prevState.emergingEntity, relationships: relationshipsLinkObject.relationships}}
        }

        case PersonCreationAction.UPDATE_PERSON_RELATION: {
            const relToUpdate = (action.payload as unknown as RelationshipCreationParams);

            const relationshipsLinkObject = new RelationshipsLinkObject(prevState.emergingEntity.relationships);
            relationshipsLinkObject.updateRelationship(relToUpdate);

            return {...prevState, emergingEntity: {...prevState.emergingEntity, relationships: relationshipsLinkObject.relationships}}
        }

        case PersonCreationAction.UPDATE_PASSPORT_DATA: {
            const payload = action.payload as unknown as Partial<PassportData>;
            let passportData: PassportData = Object.assign({},prevState.emergingEntity.passportData, payload);
            return {...prevState, emergingEntity: {...prevState.emergingEntity, passportData: passportData}}
        }

        default: {
            const parsedAction = TypedActionsUtil.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===TypedActionsUtil.personDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityCreationReducer(prevState, coreAction, initialPersonCreationState);
            } else {
                return prevState;
            }
        }
    }
}
const initialJurPersonState: JurPersonCreationState = serializableDeepCopy(new BasicJurPersonCreationState())

export type JurPersonCreationStateReducible = JurPersonCreationState|undefined;
const jurPersonCreationStateReducer: Reducer<JurPersonCreationStateReducible, PayloadAction<JurPerson>> = (prevState=initialJurPersonState, action) => {
    const actions = CreationTypedAction.person;
    switch (action.type) {
        // code-place for jur person specific actions
        // @todo write getClear action


        default: {
            const parsedAction = TypedActionsUtil.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===TypedActionsUtil.jurPersonDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityCreationReducer(prevState, coreAction, initialJurPersonState);
            }  else {
                return prevState;
            }
        }
    }
}

const initialUserCreationState: UserCreationState = serializableDeepCopy(new BasicUserCreationState());

type UserCreationStateReducible = UserCreationState|undefined;

const userCreationStateReducer: Reducer<UserCreationStateReducible, PayloadAction<User>> = (prevState=initialUserCreationState, action) => {
    const actions = CreationTypedAction.person;
    switch (action.type) {

        default: {
            const parsedAction = TypedActionsUtil.parseAction(action.type);
            if (parsedAction!==null&&parsedAction.domain===TypedActionsUtil.userDomain) {
                const coreAction: PayloadAction<any> = {...action, type: parsedAction.core}
                return entityCreationReducer(prevState, coreAction, initialUserCreationState);
            } else {
                return prevState;
            }
        }
    }
}

export const selectEmergingEntityAction = "SET_CREATING_ENTITY"
const initialEntity = Entity.PERSON;

const emergingEntitySelectReducer:  Reducer<Entity|undefined, PayloadAction<Entity>> = (prevState=initialEntity, action) => {
    if (action.type===selectEmergingEntityAction) {
        return action.payload;
    } else {
        return prevState;
    }
}

export type CreationState  = {
    user: UserCreationStateReducible,
    person: PersonCreationStateReducible,
    jurPerson: JurPersonCreationStateReducible,
    selectedEntity: Entity
}

export type CreationStateReducible  = {
    user: UserCreationStateReducible,
    person: PersonCreationStateReducible,
    jurPerson: JurPersonCreationStateReducible,
    selectedEntity: Entity
} | undefined

export const defaultCreationState: CreationState = {
    jurPerson: initialJurPersonState, person: initialPersonCreationState, selectedEntity: initialEntity, user: initialUserCreationState
}

const creationStateReducer = combineReducers({
    user: userCreationStateReducer,
    person: personCreationStateReducer,
    jurPerson: jurPersonCreationStateReducer,
    selectedEntity: emergingEntitySelectReducer
})

export default creationStateReducer;