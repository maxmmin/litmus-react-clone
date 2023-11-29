import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import {DateEntityTool} from "../../../model/DateEntity";
import {
    jurPersonDefaultValidationObject, JurPersonValidationObject
} from "../../../service/validation/jurPerson/JurPersonCreationValidationService";
import Person from "../../../model/human/person/Person";

export default interface JurPersonCreationState extends EntityCreationState<JurPersonCreationParams, JurPersonValidationObject> {

}

export type JurPersonCreationParams = Pick<JurPerson, 'name'|'edrpou'|'dateOfRegistration'|'location'|'media'>&{
    benOwner: Person|null,
    owner: Person|null
}

export const initialJurPersonCreationParams: JurPersonCreationParams = {
    benOwner: null,
    dateOfRegistration:  {...new DateEntityTool().build()},
    edrpou:  "",
    name: "",
    owner: null,
    location: null,
    media: {
        mainImage: null,
        images: []
    }
}


export class BasicJurPersonCreationState extends BasicEntityCreationState<JurPersonCreationParams, JurPersonValidationObject> implements JurPersonCreationState {
    constructor() {
        super(initialJurPersonCreationParams, jurPersonDefaultValidationObject);
    }
}