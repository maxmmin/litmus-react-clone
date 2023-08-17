import {RelationType} from "../../../model/human/person/Person";
import Sex from "../../../model/human/person/Sex";
import {GeoLocation} from "../../../model/GeoLocation";
import Form from "react-bootstrap/Form";

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
    location?: GeoLocation
}
