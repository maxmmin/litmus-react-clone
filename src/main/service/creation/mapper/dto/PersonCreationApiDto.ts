import {RelationType} from "../../../../model/human/person/Person";
import Sex from "../../../../model/human/person/Sex";
import {LocationCreationApiDto} from "../../../../model/Location";

export type RelationshipCreationApiDto = {
    personId?: string,
    type?: RelationType,
    note?: string
}

export type PassportDataCreationApiDto = {
    passportSerial?: string;
    passportNumber?: string;
    rnokppCode?: string;
}

export default interface PersonCreationApiDto {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    relationships?: RelationshipCreationApiDto[],
    sex?: Sex;
    passportData?: PassportDataCreationApiDto;
    dateOfBirth?: string;
    location?: LocationCreationApiDto
}