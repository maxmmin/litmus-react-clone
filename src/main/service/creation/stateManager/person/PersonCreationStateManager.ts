import Person, {Relationship} from "../../../../model/human/person/Person";
import GeoStateManager from "../GeoStateManager";
import {
    PersonValidationObject,
    RelationShipValidationObject
} from "../../validation/human/person/PersonCreationValidationService";
import MediaEntityCreationStateManager from "../MediaCreationStateManager";
import ImageStateManager from "../../../media/ImageStateService";

class CreationPassportData {
}

interface PersonCreationStateManager extends MediaEntityCreationStateManager<Person,PersonValidationObject>, ImageStateManager, GeoStateManager {
    setRelationshipValidationErrors(relObject: RelationShipValidationObject): void;

    getRelationshipValidationErrors (rel: Relationship): RelationShipValidationObject;

    getRelationshipsValidationErrors (): RelationShipValidationObject[];

    setRelationshipValidationErrors(relationship: RelationShipValidationObject): void;

    getRelationshipValidationErrors(rel: Relationship): RelationShipValidationObject;

    updateRelationshipValidationErrors(relationship: RelationShipValidationObject): void;

    updatePassportData: (data: Partial<CreationPassportData>) => void;

    addRelationship: (relationship: Relationship) => void;

    removeRelationship: (relationship: Relationship) => void;

    updateRelationship: (relationship: Relationship) => void;
}

export default PersonCreationStateManager;