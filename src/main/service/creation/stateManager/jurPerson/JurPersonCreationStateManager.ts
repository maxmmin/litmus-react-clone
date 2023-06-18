import CreationStateManager from "../CreationStateManager";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import {JurPersonCreationParams, PersonCreationParams} from "../../../../redux/actions/CreationCoreActions";
import {PassportData} from "../../../../model/human/person/PassportData";

interface JurPersonCreationStateManager extends CreationStateManager<EntityCreationState<JurPersonCreationParams>> {
}

export default JurPersonCreationStateManager;