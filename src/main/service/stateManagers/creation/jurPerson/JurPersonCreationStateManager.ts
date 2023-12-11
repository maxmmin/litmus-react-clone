import CreationStateManager from "../CreationStateManager";
import {PreProcessedJurPerson} from "../../../../model/jurPerson/JurPerson";
import GeoStateManager from "../GeoStateManager";
import {
    JurPersonValidationObject
} from "../../../validation/jurPerson/JurPersonCreationValidationService";
import {JurPersonCreationParams} from "../../../../redux/types/creation/JurPersonCreationState";
import ImageStateManager from "../../../media/ImageStateManager";
import SourceContainableEntityStateManager from "../SourceContainableEntityStateManager";

interface JurPersonCreationStateManager extends CreationStateManager<PreProcessedJurPerson, JurPersonCreationParams,
    JurPersonValidationObject>,ImageStateManager, GeoStateManager, SourceContainableEntityStateManager {
}

export default JurPersonCreationStateManager;