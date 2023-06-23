import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import Person from "../../../model/human/person/Person";

export default interface PersonCreationState extends EntityCreationState<Person>{}

export class BasicPersonCreationState extends BasicEntityCreationState<Person> implements PersonCreationState {}