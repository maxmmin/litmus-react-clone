import {PersonCreationAction} from "../../../../redux/actions/CreationCoreAction";
import PersonCreationStateManager from "./PersonCreationStateManager";
import {PayloadAction} from "@reduxjs/toolkit";
import store, {AppDispatch} from "../../../../redux/store";
import {PreProcessedPerson} from "../../../../model/human/person/Person";
import CreationTypedAction from "../../../../redux/actions/CreationTypedAction";
import PassportData from "../../../../model/human/person/PassportData";

import {GeoLocation} from "../../../../model/GeoLocation";
import {
    PersonValidationObject,
    RelationShipValidationObject
} from "../../../validation/human/person/PersonCreationValidationService";
import MediaEntityCreationStateManagerImpl from "../MediaEntityCreationStateManagerImpl";
import {PersonCreationParams, RelationshipCreationParams} from "../../../coreServices/creation/PersonCreationService";
import RelationshipsLinkObject from "../../../../util/person/RelationshipsLinkObject";
import SourceValidationObject from "../../../validation/validationModels/SourceValidationObject";


class PersonCreationStateManagerImpl extends MediaEntityCreationStateManagerImpl<PreProcessedPerson,PersonCreationParams, PersonValidationObject> implements PersonCreationStateManager {
    constructor() {
        const dispatch: AppDispatch = store.dispatch;
        const getState = ()=>store.getState().creation.person!;
        super(dispatch, getState, CreationTypedAction.person);
    }

    getValidationSourcesErrors(): SourceValidationObject[] {
        return this.getValidationErrors().sources;
    }

    setValidationSourcesErrors(validationErrors: SourceValidationObject[]): void {
        this.updateValidationErrors({sources: validationErrors})
    }



    appendSource(source: string): number {
        const sources: string[] = [...this.getSources(), source];
        this.setSources(sources);
        return sources.length;
    }

    getSources(): string[] {
        return this.getCreationParams().sources;
    }

    removeSource(source: string): number {
        const sources = this.getSources();
        const sIndex = sources.indexOf(source);
        if (sIndex === -1) throw new Error("source does not found")
        else {
            const copy = [...sources];
            copy.splice(sIndex, 1);
            this.setSources(copy);
            return copy.length;
        }
    }

    setSources(sources: string[]): void {
        this.updateEntityCreationParams({sources: sources})
    }



    updateRelationshipValidationErrors(relObject: Partial<RelationShipValidationObject>&Pick<RelationShipValidationObject,'relationship'>): void {
        const relationShipValidationErrors: RelationShipValidationObject[] = [...this.getValidationErrors().relationships];
        const relObjectInd: number = relationShipValidationErrors.findIndex(obj=>RelationshipsLinkObject.checkIsEqual(obj.relationship,relObject.relationship));
        if (relObjectInd===-1) throw new Error("no such creation object");
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
        if (relObjectInd===-1) throw new Error("no such creation object");
        relationShipValidationErrors.splice(relObjectInd,1,relObject);
        this.updateValidationErrors({relationships: relationShipValidationErrors});
    }

    getRelationshipValidationErrors(rel: RelationshipCreationParams): RelationShipValidationObject {
        const relationShipValidationErrors: RelationShipValidationObject[] = this.getValidationErrors().relationships;
        const validationObject: RelationShipValidationObject|undefined = relationShipValidationErrors.find(obj => RelationshipsLinkObject.checkIsEqual(obj.relationship, rel));
        if (!validationObject) throw new Error("no such creation object");
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

    addRelationship(relationship: RelationshipCreationParams): void {
        const action: PayloadAction<RelationshipCreationParams, PersonCreationAction> = {
            type: PersonCreationAction.ADD_PERSON_RELATION,
            payload: relationship
        }
        this.dispatch(action)
    }

    removeRelationship(relationship: RelationshipCreationParams): void {
        const action: PayloadAction<RelationshipCreationParams, PersonCreationAction> = {
            type: PersonCreationAction.REMOVE_PERSON_RELATION,
            payload: relationship
        }
        this.dispatch(action)
    }

    updateRelationship(relationship: RelationshipCreationParams): void {
        const action: PayloadAction<RelationshipCreationParams, PersonCreationAction> = {
            type: PersonCreationAction.UPDATE_PERSON_RELATION,
            payload: relationship
        }
        this.dispatch(action)
    }


}

export default PersonCreationStateManagerImpl;