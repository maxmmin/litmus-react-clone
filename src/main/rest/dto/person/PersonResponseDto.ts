import Sex from "../../../model/human/person/Sex";
import PassportData from "../../../model/human/person/PassportData";
import {GeoLocation} from "../../../model/GeoLocation";
import {Relationship} from "../../../model/human/person/Person";

interface PersonResponseDto {
    id: string;
    firstName: string;
    middleName?: string|null;
    lastName: string;
    relationships?: Relationship[]|null,
    sex: Sex;
    passportData?: Partial<PassportData> | null;
    dateOfBirth?: string | null;
    location?: GeoLocation | null
}

export default PersonResponseDto;