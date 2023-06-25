import CreationStateManager from "../CreationStateManager";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import GeoStateManager from "../GeoStateManager";

interface JurPersonCreationStateManager extends CreationStateManager<JurPerson>, GeoStateManager {
}

export default JurPersonCreationStateManager;