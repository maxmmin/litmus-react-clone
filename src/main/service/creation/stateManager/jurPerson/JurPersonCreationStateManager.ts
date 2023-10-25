import CreationStateManager from "../CreationStateManager";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import GeoStateManager from "../GeoStateManager";
import {
    JurPersonValidationObject
} from "../../validation/jurPerson/JurPersonCreationValidationService";
import {JurPersonCreationParams} from "../../../../redux/types/creation/JurPersonCreationState";
import ImageStateManager from "../../../media/ImageStateManager";

interface JurPersonCreationStateManager extends CreationStateManager<JurPerson, JurPersonCreationParams, JurPersonValidationObject>,ImageStateManager, GeoStateManager {
}

export default JurPersonCreationStateManager;