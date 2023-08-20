import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import {DateEntityTool} from "../../../model/DateEntity";
import {
    jurPersonDefaultValidationObject, JurPersonValidationObject
} from "../../../service/creation/validation/jurPerson/JurPersonCreationValidationService";

export default interface JurPersonCreationState extends EntityCreationState<JurPerson, JurPersonValidationObject> {

}

export const initialJurPersonCreationParams: JurPerson = {
    id: '-1',
    benOwner: null,
    dateOfRegistration:  {...new DateEntityTool().build()},
    edrpou:  "",
    name: "",
    owner: null,
    location: null
}


export class BasicJurPersonCreationState extends BasicEntityCreationState<JurPerson, JurPersonValidationObject> implements JurPersonCreationState {
    constructor() {
        super(initialJurPersonCreationParams, jurPersonDefaultValidationObject);
    }
}