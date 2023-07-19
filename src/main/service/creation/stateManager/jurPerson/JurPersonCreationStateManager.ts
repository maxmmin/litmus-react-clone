import CreationStateManager from "../CreationStateManager";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import GeoStateManager from "../GeoStateManager";
import {
    JurPersonValidationObject
} from "../../validation/jurPerson/JurPersonCreationValidationService";

interface JurPersonCreationStateManager extends CreationStateManager<JurPerson, JurPersonValidationObject>, GeoStateManager {
}

export default JurPersonCreationStateManager;