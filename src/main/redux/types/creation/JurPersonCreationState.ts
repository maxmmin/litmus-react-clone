import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import {DateBuilder} from "../../../model/DateEntity";

export default interface JurPersonCreationState extends EntityCreationState<JurPerson> {

}

export const initialJurPersonCreationParams: JurPerson = {
    id: '-1',
    benOwner: null,
    dateOfRegistration:  {...new DateBuilder().build()},
    edrpou:  "",
    name: "",
    owner: null,
    location: null
}


export class BasicJurPersonCreationState extends BasicEntityCreationState<JurPerson> implements JurPersonCreationState {
    constructor() {
        super(initialJurPersonCreationParams, {});
    }
}