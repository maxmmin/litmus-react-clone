import CreationStateManager from "../CreationStateManager";
import {PersonCreationParams} from "../../../../redux/actions/CreationCoreActions";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import {Relationship} from "../../../../model/human/person/Person";
import {CreationPassportData} from "../../../../model/human/person/PassportData";

interface PersonCreationStateManager extends CreationStateManager<EntityCreationState<PersonCreationParams>> {
    updatePassportData: (data: Partial<CreationPassportData>) => void;

    addRelationship: (relationship: Relationship) => void;

    removeRelationship: (relationship: Relationship) => void;

    updateRelationship: (relationship: Relationship) => void;
}

export default PersonCreationStateManager;