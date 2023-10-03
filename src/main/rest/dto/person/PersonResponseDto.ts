import Sex from "../../../model/human/person/Sex";
import PassportData from "../../../model/human/person/PassportData";
import {GeoLocation} from "../../../model/GeoLocation";
import Person, {Relationship, RelationType} from "../../../model/human/person/Person";
import Media from "../../../model/Media";

export interface RelationshipResponseDto {
    person: PersonResponseDto,
    type: RelationType | null,
    note: string
}

type RelationshipsScanOptionsResponseDto = {
    depth: number
}

export type RelationshipsInfoResponseDto = {
    scanOptions: RelationshipsScanOptionsResponseDto,
    relationships: RelationshipResponseDto[]|null
}

interface PersonResponseDto {
    id: number;
    media: Media | null;
    firstName: string;
    middleName?: string|null;
    lastName: string;
    relationshipsInfo: RelationshipsInfoResponseDto,
    sex: Sex;
    passportData?: Partial<PassportData> | null;
    dateOfBirth?: string | null;
    location?: GeoLocation | null
}

export default PersonResponseDto;