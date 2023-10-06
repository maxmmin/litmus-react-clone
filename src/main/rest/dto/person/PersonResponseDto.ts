import Sex from "../../../model/human/person/Sex";
import PassportData from "../../../model/human/person/PassportData";
import {GeoLocation} from "../../../model/GeoLocation";
import {
    Relationship,
    RelationType
} from "../../../model/human/person/Person";
import Media from "../../../model/Media";

export interface RelationshipResponseDto {
    person: RelatedPersonResponseDto,
    type: RelationType | null,
    note: string
}

export type NestedPersonResponseDto = Pick<PersonResponseDto, 'id'> & {
    id: number,
    relationshipsInfo: NestedRelationshipsInfoResponseDto
}

export type NestedRelationshipResponseDto = Pick<Relationship, 'note'|'type'> & {
    person: NestedPersonResponseDto
}

export type RelationshipsScanOptionsResponseDto = {
    depth: number
}

export type RelationshipsInfoResponseDto = {
    scanOptions: RelationshipsScanOptionsResponseDto,
    relationships: RelationshipResponseDto[]|null
}

export type RelatedPersonResponseDto = Omit<PersonResponseDto, "relationshipsInfo"> & {
    relationshipsInfo: NestedRelationshipsInfoResponseDto
}

export type NestedRelationshipsInfoResponseDto = {
    scanOptions: RelationshipsScanOptionsResponseDto,
    relationships: NestedRelationshipResponseDto[]|null
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