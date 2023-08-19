import {PersonCreationAction} from "../../../../redux/actions/CreationCoreAction";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import CreationStateManagerImpl from "../CreationStateManagerImpl";
import PersonCreationStateManager from "./PersonCreationStateManager";
import {PayloadAction} from "@reduxjs/toolkit";
import store, {AppDispatch} from "../../../../redux/store";
import Person, {Relationship, RelationshipsLinkObject} from "../../../../model/human/person/Person";
import CreationTypedAction from "../../../../redux/actions/CreationTypedAction";
import PassportData from "../../../../model/human/person/PassportData";

import {GeoLocation} from "../../../../model/GeoLocation";
import {
    PersonValidationObject,
    RelationShipValidationObject
} from "../../validation/human/person/PersonCreationValidationService";
import MediaEntityCreationStateManagerImpl from "../MediaEntityCreationStateManagerImpl";

class PersonCreationStateManagerImpl extends MediaEntityCreationStateManagerImpl<Person, PersonValidationObject> implements PersonCreationStateManager {


    constructor() {
        const dispatch: AppDispatch = store.dispatch;
        const getState = ()=>store.getState().creation.person!;
        super(dispatch, getState, CreationTypedAction.person);
    }


    updateRelationshipValidationErrors(relObject: RelationShipValidationObject): void {
        const relationShipValidationErrors: RelationShipValidationObject[] = [...this.getValidationErrors().relationships];
        const relObjectInd: number = relationShipValidationErrors.findIndex(obj=>RelationshipsLinkObject.checkIsEqual(obj.relationship,relObject.relationship));
        if (relObjectInd===-1) throw new Error("no such validation object");
        const prev = relationShipValidationErrors[relObjectInd];
        relationShipValidationErrors.splice(relObjectInd,1,{...prev, ...relObject});
        this.updateValidationErrors({relationships: relationShipValidationErrors})
    }

    getRelationshipsValidationErrors(): RelationShipValidationObject[] {
        return this.getValidationErrors().relationships;
    }

    setRelationshipValidationErrors(relObject: RelationShipValidationObject): void {
        const relationShipValidationErrors: RelationShipValidationObject[] = [...this.getValidationErrors().relationships];
        const relObjectInd: number = relationShipValidationErrors.findIndex(obj=>RelationshipsLinkObject.checkIsEqual(obj.relationship,relObject.relationship));
        if (relObjectInd===-1) throw new Error("no such validation object");
        relationShipValidationErrors.splice(relObjectInd,1,relObject);
        this.updateValidationErrors({relationships: relationShipValidationErrors});
    }

    getRelationshipValidationErrors(rel: Relationship): RelationShipValidationObject {
        const relationShipValidationErrors: RelationShipValidationObject[] = this.getValidationErrors().relationships;
        const validationObject: RelationShipValidationObject|undefined = relationShipValidationErrors.find(obj => RelationshipsLinkObject.checkIsEqual(obj.relationship, rel));
        if (!validationObject) throw new Error("no such validation object");
            else return validationObject;
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