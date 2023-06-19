import Sex from "../../../model/human/person/Sex";
import PassportData from "../../../model/human/person/PassportData";
import {Location} from "../../../model/Location";
import {Relationship} from "../../../model/human/person/Person";

type PersonResponseDto = {
    id: string,
    firstName: string;
    middleName?: string|null;
    lastName: string;
    relationships?: Relationship[]|null,
    sex: Sex;
    passportData?: Partial<PassportData> | null;
    dateOfBirth?: string | null;
    location?: Location | null
}

export default PersonResponseDto;