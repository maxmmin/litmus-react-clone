import CreationStateManager from "../CreationStateManager";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import Person, {Relationship} from "../../../../model/human/person/Person";
import GeoStateManager from "../GeoStateManager";

class CreationPassportData {
}

interface PersonCreationStateManager extends CreationStateManager<Person, EntityCreationState<Person>>, GeoStateManager {

    updatePassportData: (data: Partial<CreationPassportData>) => void;

    addRelationship: (relationship: Relationship) => void;

    removeRelationship: (relationship: Relationship) => void;

    updateRelationship: (relationship: Relationship) => void;
}

export default PersonCreationStateManager;