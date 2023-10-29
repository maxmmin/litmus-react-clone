import Sex from "../../../model/human/person/Sex";
import PassportData from "../../../model/human/person/PassportData";
import {GeoLocation} from "../../../model/GeoLocation";
import {
    Relationship,
    RelationType
} from "../../../model/human/person/Person";
import Media, {MediaResponseDto} from "../../../model/Media";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonResponseDto, {
    EmbedJurPersonResponseDto,
    MinifiedJurPersonResponseDto
} from "../jurPerson/JurPersonResponseDto";

export interface RelationshipResponseDto {
    person: RelatedPersonResponseDto,
    type: RelationType | null,
    note: string
}

export type NestedPersonResponseDto = Pick<PersonResponseDto, 'id'> & {
    id: number,
    relationshipsInfo: NestedRelationshipsInfo
}

export type NestedRelationshipResponseDto = Pick<Relationship, 'note'|'type'> & {
    person: NestedPersonResponseDto
}

export type RelationshipsScanOptionsResponseDto = {
    depth: number
}

export type RelationshipsInfo = {
    scanOptions: RelationshipsScanOptionsResponseDto,
    relationships: RelationshipResponseDto[]|null
}

export type RelatedPersonResponseDto = Omit<PersonResponseDto, "relationshipsInfo"|'ownedJurPersons'|'benOwnedJurPersons'> & {
    relationshipsInfo: NestedRelationshipsInfo,
    ownedJurPersons: (EmbedJurPersonResponseDto|MinifiedJurPersonResponseDto)[],
    benOwnedJurPersons: (EmbedJurPersonResponseDto|MinifiedJurPersonResponseDto)[],
}

export type NestedRelationshipsInfo = {
    scanOptions: RelationshipsScanOptionsResponseDto,
    relationships: NestedRelationshipResponseDto[]|null
}

export type SimplePersonResponseDto = Pick<PersonResponseDto, 'id'|'firstName'|'middleName'|'lastName'|'sex'|'media'|'location'>

export type EmbedPersonResponseDto = Pick<PersonResponseDto, 'firstName'|'middleName'|'lastName'>&NestedPersonResponseDto

interface PersonResponseDto {
    id: number;
    media: MediaResponseDto;
    firstName: string;
    middleName: string|null;
    lastName: string;
    relationshipsInfo: RelationshipsInfo | null,
    ownedJurPersons: EmbedJurPersonResponseDto[],
    benOwnedJurPersons: EmbedJurPersonResponseDto[],
    sex: Sex;
    passportData: Partial<PassportData> | null;
    dateOfBirth: string | null;
    location: GeoLocation | null
}

export default PersonResponseDto;