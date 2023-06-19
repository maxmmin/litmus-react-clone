import {RelationType} from "../../../model/human/person/Person";
import Sex from "../../../model/human/person/Sex";
import {Location} from "../../../model/Location";

export type RelationshipRequestDto = {
    personId?: string,
    type?: RelationType,
    note?: string
}

export type PassportDataRequestDto = {
    passportSerial?: string;
    passportNumber?: string;
    rnokppCode?: string;
}

export default interface PersonRequestDto {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    relationships?: RelationshipRequestDto[],
    sex?: Sex;
    passportData?: PassportDataRequestDto;
    dateOfBirth?: string;
    location?: Location
}