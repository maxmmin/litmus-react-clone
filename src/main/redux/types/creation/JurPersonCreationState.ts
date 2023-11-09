import EntityCreationState, {BasicEntityCreationState} from "./EntityCreationState";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import {DateEntityTool} from "../../../model/DateEntity";
import {
    jurPersonDefaultValidationObject, JurPersonValidationObject
} from "../../../service/creation/validation/jurPerson/JurPersonCreationValidationService";
import {SimplePersonResponseDto} from "../../../rest/dto/person/PersonResponseDto";
import Person from "../../../model/human/person/Person";

export default interface JurPersonCreationState extends EntityCreationState<JurPersonCreationParams, JurPersonValidationObject> {

}

export type JurPersonCreationParams = Omit<JurPerson, 'id'|"owner"|"benOwner">&{
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