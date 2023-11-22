import Sex from "../../../model/human/person/Sex";
import PassportData from "../../../model/human/person/PassportData";
import {GeoLocation} from "../../../model/GeoLocation";
import {
    Relationship,
} from "../../../model/human/person/Person";
import {MediaResponseDto} from "../../../model/Media";
import {
    EmbedJurPersonResponseDto,
    MinifiedJurPersonResponseDto
} from "../jurPerson/JurPersonResponseDto";

export type RelationshipResponseDto = Pick<Relationship, 'note'|'type'> & {
    person: RelatedPersonResponseDto
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

export type EmbedPersonResponseDto = Pick<PersonResponseDto, 'firstName'|'middleName'|'lastName'|'sex'>&NestedPersonResponseDto

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