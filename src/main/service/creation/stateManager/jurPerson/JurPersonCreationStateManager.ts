import CreationStateManager from "../CreationStateManager";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import GeoStateManager from "../GeoStateManager";
import {
    JurPersonValidationObject
} from "../../validation/jurPerson/JurPersonCreationValidationService";
import {JurPersonCreationParams} from "../../../../redux/types/creation/JurPersonCreationState";

interface JurPersonCreationStateManager extends CreationStateManager<JurPerson, JurPersonCreationParams, JurPersonValidationObject>, GeoStateManager {
}

export default JurPersonCreationStateManager;