import {PersonCreationAction, PersonCreationParams} from "../../../../redux/actions/CreationCoreActions";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import CreationStateManagerImpl from "../CreationStateManagerImpl";
import PersonCreationStateManager from "./PersonCreationStateManager";
import {PayloadAction} from "@reduxjs/toolkit";
import store, {AppDispatch} from "../../../../redux/store";
import CreationTypedActions from "../../../../redux/actions/CreationTypedActions";
import {Relationship} from "../../../../model/human/person/Person";
import {CreationPassportData} from "../../../../model/human/person/PassportData";

class PersonCreationStateManagerImpl extends CreationStateManagerImpl<EntityCreationState<PersonCreationParams>> implements PersonCreationStateManager {


    constructor(_store: typeof store, actions: CreationTypedActions = CreationTypedActions.person) {
        const dispatch: AppDispatch = _store.dispatch;
        const getState = ()=>_store.getState().creation.person!;
        super(dispatch, getState, actions);
    }

    updatePassportData = (data: Partial<CreationPassportData>): void => {
        const action: PayloadAction<Partial<CreationPassportData>, PersonCreationAction> = {
            type: PersonCreationAction.UPDATE_PASSPORT_DATA,
            payload: data
        }
        this.dispatch(action)
    };

    addRelationship(relationship: Relationship): void {
        const action: PayloadAction<Relationship, PersonCreationAction> = {
            type: PersonCreationAction.ADD_PERSON_RELATION,
            payload: relationship
        }
        this.dispatch(action)
    }

    removeRelationship(relationship: Relationship): void {
        const action: PayloadAction<Relationship, PersonCreationAction> = {
            type: PersonCreationAction.REMOVE_PERSON_RELATION,
            payload: relationship
        }
        this.dispatch(action)
    }

    updateRelationship(relationship: Relationship): void {
        const action: PayloadAction<Relationship, PersonCreationAction> = {
            type: PersonCreationAction.UPDATE_PERSON_RELATION,
            payload: relationship
        }
        this.dispatch(action)
    }


}

export default PersonCreationStateManagerImpl;