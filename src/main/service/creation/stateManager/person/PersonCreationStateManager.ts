import CreationStateManager from "../CreationStateManager";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import Person, {Relationship} from "../../../../model/human/person/Person";
import GeoStateManager from "../GeoStateManager";
import {
    PersonValidationObject,
    RelationShipValidationObject
} from "../../validation/human/person/PersonCreationValidationService";

class CreationPassportData {
}

interface PersonCreationStateManager extends CreationStateManager<Person, PersonValidationObject>, GeoStateManager {
    setRelationshipValidationErrors(relObject: RelationShipValidationObject): void;

    getRelationshipValidationErrors (rel: Relationship): RelationShipValidationObject;

    getRelationshipsValidationErrors (): RelationShipValidationObject[];

    updatePassportData: (data: Partial<CreationPassportData>) => void;

    addRelationship: (relationship: Relationship) => void;

    removeRelationship: (relationship: Relationship) => void;

    updateRelationship: (relationship: Relationship) => void;
}

export default PersonCreationStateManager;