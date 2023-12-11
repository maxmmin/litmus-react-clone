import Person, {PreProcessedPerson, Relationship} from "../../../../model/human/person/Person";
import GeoStateManager from "../GeoStateManager";
import {
    PersonValidationObject,
    RelationShipValidationObject
} from "../../../validation/human/person/PersonCreationValidationService";
import MediaEntityCreationStateManager from "../MediaEntityCreationStateManager";
import ImageStateManager from "../../../media/ImageStateManager";
import {PersonCreationParams, RelationshipCreationParams} from "../../../coreServices/creation/PersonCreationService";
import SourceContainableEntityStateManager from "../SourceContainableEntityStateManager";

class CreationPassportData {
}

interface PersonCreationStateManager extends MediaEntityCreationStateManager<PreProcessedPerson,PersonCreationParams,PersonValidationObject>, ImageStateManager, SourceContainableEntityStateManager, GeoStateManager {
    setRelationshipValidationErrors(relObject: RelationShipValidationObject): void;

    getRelationshipValidationErrors (rel: RelationshipCreationParams): RelationShipValidationObject;

    getRelationshipsValidationErrors (): RelationShipValidationObject[];

    setRelationshipValidationErrors(relationship: RelationShipValidationObject): void;

    getRelationshipValidationErrors(rel: RelationshipCreationParams): RelationShipValidationObject;

    updateRelationshipValidationErrors(relationship: Partial<RelationShipValidationObject>&Pick<RelationShipValidationObject,'relationship'>): void;

    updatePassportData: (data: Partial<CreationPassportData>) => void;

    addRelationship: (relationship: RelationshipCreationParams) => void;

    removeRelationship: (relationship: RelationshipCreationParams) => void;

    updateRelationship: (relationship: RelationshipCreationParams) => void;
}

export default PersonCreationStateManager;