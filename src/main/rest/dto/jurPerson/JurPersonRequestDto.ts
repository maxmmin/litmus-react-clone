import {Location} from "../../../model/Location";

export default interface JurPersonRequestDto {
    benOwnerId?: string,
    dateOfRegistration?:  string,
    edrpou?:  string,
    name?: string,
    ownerId?: string,
    location?: Location
}
