import {RelationType} from "../../../model/human/person/Person";
import Sex from "../../../model/human/person/Sex";
import {GeoLocation} from "../../../model/GeoLocation";
import MediaEntity from "../../../model/MediaEntity";

export type RelationshipRequestDto = {
    personId: number,
    type?: RelationType,
    note?: string
}

export type PassportDataRequestDto = {
    passportSerial?: string;
    passportNumber?: string;
    rnokppCode?: string;
}

export default interface PersonRequestDto extends Partial<MediaEntity>{
    firstName?: string;
    middleName?: string;
    lastName?: string;
    relationships?: RelationshipRequestDto[],
    sex?: Sex;
    passportData?: PassportDataRequestDto;
    dateOfBirth?: string;
    location?: GeoLocation;
    sources?: string[];
}
