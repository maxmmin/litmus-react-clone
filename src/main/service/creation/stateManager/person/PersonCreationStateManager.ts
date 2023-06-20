import CreationStateManager from "../CreationStateManager";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import Person, {Relationship} from "../../../../model/human/person/Person";

class CreationPassportData {
}

interface PersonCreationStateManager extends CreationStateManager<Person, EntityCreationState<Person>> {

    updatePassportData: (data: Partial<CreationPassportData>) => void;

    addRelationship: (relationship: Relationship) => void;

    removeRelationship: (relationship: Relationship) => void;

    updateRelationship: (relationship: Relationship) => void;
}

export default PersonCreationStateManager;