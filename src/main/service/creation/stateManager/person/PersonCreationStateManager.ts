import CreationStateManager from "../CreationStateManager";
import {PersonCreationParams} from "../../../../redux/actions/CreationCoreActions";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import {PassportData} from "../../../../model/human/person/PassportData";
import {Relationship, RelationshipsLinkObject} from "../../../../model/human/person/Person";

interface PersonCreationStateManager extends CreationStateManager<EntityCreationState<PersonCreationParams>> {
    updatePassportData: (data: Partial<PassportData>) => void;

    addRelationship: (relationship: Relationship) => void;

    removeRelationship: (relationship: Relationship) => void;

    updateRelationship: (relationship: Relationship) => void;
}

export default PersonCreationStateManager;