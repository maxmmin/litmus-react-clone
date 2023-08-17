import Sex from "../../../model/human/person/Sex";
import PassportData from "../../../model/human/person/PassportData";
import {GeoLocation} from "../../../model/GeoLocation";
import {Relationship} from "../../../model/human/person/Person";
import Media from "../../../model/Media";

interface PersonResponseDto {
    id: string;
    media: Media | null;
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