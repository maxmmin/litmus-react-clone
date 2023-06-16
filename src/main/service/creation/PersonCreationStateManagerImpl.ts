import CreationStateManager from "./CreationStateManager";
import {PersonCreationParams} from "../../redux/creation/CreationCoreActions";
import EntityCreationState from "../../redux/creation/EntityCreationState";
import CreationStateManagerImpl from "./CreationStateManagerImpl";

class PersonCreationStateManagerImpl extends CreationStateManagerImpl<PersonCreationParams,EntityCreationState<PersonCreationParams>> implements PersonCreat {

}