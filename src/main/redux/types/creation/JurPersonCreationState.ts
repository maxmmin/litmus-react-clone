import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import {JurPerson} from "../../../model/jurPerson/JurPerson";

export default interface JurPersonCreationState extends EntityCreationState<JurPerson> {

}

export class BasicJurPersonCreationState extends BasicEntityCreationState<JurPerson> implements JurPersonCreationState {}