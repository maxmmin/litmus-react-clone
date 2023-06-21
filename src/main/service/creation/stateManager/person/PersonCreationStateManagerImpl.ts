import {PersonCreationAction} from "../../../../redux/actions/CreationCoreAction";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import CreationStateManagerImpl from "../CreationStateManagerImpl";
import PersonCreationStateManager from "./PersonCreationStateManager";
import {PayloadAction} from "@reduxjs/toolkit";
import store, {AppDispatch} from "../../../../redux/store";
import Person, {Relationship} from "../../../../model/human/person/Person";
import CreationTypedAction from "../../../../redux/actions/CreationTypedAction";
import PassportData from "../../../../model/human/person/PassportData";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../../../inversify/IOC_TYPES";
import {GeoLocation} from "../../../../model/GeoLocation";

@injectable()
class PersonCreationStateManagerImpl extends CreationStateManagerImpl<Person, EntityCreationState<Person>> implements PersonCreationStateManager {


    constructor(@inject(IOC_TYPES.Store) _store: typeof store, @inject(IOC_TYPES.creation.typedActions.PersonCreationTypedAction) actions: CreationTypedAction) {
        const dispatch: AppDispatch = _store.dispatch;
        const getState = ()=>_store.getState().creation.person!;
        super(dispatch, getState, actions);
    }

    clearLocation(): void {
        this.updateLocation(null);
    }

    updateLocation(location: GeoLocation|null): void {
        this.updateEntityCreationParams({location: location})
    }

    getLocation (): GeoLocation | null {
        return this.getCreationParams().location;
    }

    updatePassportData = (data: Partial<PassportData>): void => {
        const action: PayloadAction<Partial<PassportData>, PersonCreationAction> = {
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