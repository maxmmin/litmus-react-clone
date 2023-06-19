import CreationStateManager from "../CreationStateManager";
import EntityCreationState from "../../../../redux/types/creation/EntityCreationState";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";

interface JurPersonCreationStateManager extends CreationStateManager<EntityCreationState<JurPerson>> {
}

export default JurPersonCreationStateManager;