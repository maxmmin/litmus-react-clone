import {Reducer} from "react";
import CreationParamsActions, {
    CreationParams,
    CreationParamsReducible, JurPersonCreationParams,
    PersonCreationParams, UserCreationParams
} from "./CreationParamsActions";
import {PayloadAction} from "@reduxjs/toolkit";
import {Entity} from "../exploration/EntityExplorationState";
import AuthActions from "../auth/AuthActions";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import Person, {Relationship, RelationshipsLinkObject} from "../../model/person/Person";
import User from "../../model/user/User";
import {PassportData} from "../../model/person/PassportData";
import Sex from "../../model/person/Sex";

const initialState: CreationParams = {
    table: Entity.PERSONS,
    jurPersonCreationData: {...new JurPersonCreationParams()},
    personCreationData: {...new PersonCreationParams()},
    userCreationData: {...new UserCreationParams()},
    pending: false
}

const creationParamsReducer: Reducer<CreationParamsReducible, PayloadAction<CreationParams>> = (prevState= initialState, action) => {
    switch (action.type) {
        case CreationParamsActions.SET_CREATION_PARAMS: {
            return action.payload;
        }

        case CreationParamsActions.UPDATE_CREATION_PARAMS: {
            return {...prevState, ...action.payload}
        }

        /**
         *  jur person specified
         */
        case CreationParamsActions.UPDATE_JUR_PERSON_CREATION_DATA: {
            return {...prevState, jurPersonCreationData: {...prevState.jurPersonCreationData, ...(action.payload as unknown as Partial<JurPerson>)}}
        }


        /**
         *  person specified
         */
        case CreationParamsActions.UPDATE_PERSON_CREATION_DATA: {
            return {...prevState, personCreationData: {...prevState.personCreationData, ...(action.payload as unknown as Partial<Person>)}}
        }

        case CreationParamsActions.UPDATE_PERSON_SEX: {
            return {...prevState, personCreationData: {...prevState.personCreationData, sex: action.payload as unknown as Sex}}
        }

        case CreationParamsActions.ADD_PERSON_RELATION: {
            const relToAdd = (action.payload as unknown as Relationship);

            const relationshipsLinkObject = new RelationshipsLinkObject(prevState.personCreationData.relationships);
            relationshipsLinkObject.addRelationship(relToAdd);

            return {...prevState, personCreationData: {...prevState.personCreationData, relationships: relationshipsLinkObject.relationships}}
        }

        case CreationParamsActions.REMOVE_PERSON_RELATION: {
            const relToAdd = (action.payload as unknown as Relationship);

            const relationshipsLinkObject = new RelationshipsLinkObject(prevState.personCreationData.relationships);
            relationshipsLinkObject.removeRelationship(relToAdd);

            return {...prevState, personCreationData: {...prevState.personCreationData, relationships: relationshipsLinkObject.relationships}}
        }

        case CreationParamsActions.UPDATE_PERSON_RELATION: {
            const relToUpdate = (action.payload as unknown as Relationship);

            const relationshipsLinkObject = new RelationshipsLinkObject(prevState.personCreationData.relationships);
            relationshipsLinkObject.updateRelationship(relToUpdate);

            return {...prevState, personCreationData: {...prevState.personCreationData, relationships: relationshipsLinkObject.relationships}}
        }

        case CreationParamsActions.UPDATE_PASSPORT_DATA: {
            const payload = action.payload as unknown as Partial<PassportData>;

            let passportData: PassportData = Object.assign({},prevState.personCreationData.passportData, payload);
            return {...prevState, personCreationData: {...prevState.personCreationData, passportData}}
        }

        /**
         *  user specified
         */

        case CreationParamsActions.UPDATE_USER_CREATION_DATA: {
            return {...prevState, userCreationData: {...prevState.userCreationData, ...(action.payload as unknown as Partial<User>)}}
        }

        /**
         *  non-business-logic
         */
        case AuthActions.CLEAR_AUTH: {
            return initialState
        }

        case CreationParamsActions.SET_CREATION_PENDING: {
            const act = action as unknown as PayloadAction<boolean>
            return {...prevState, pending: act.payload}
        }

        default: {
            return prevState;
        }
    }
}

export default creationParamsReducer;