import {Location} from "../../../../model/Location";

export default interface JurPersonCreationApiDto {
    benOwnerId?: string,
    dateOfRegistration?:  string,
    edrpou?:  string,
    name?: string,
    ownerId?: string,
    location?: Location
}
