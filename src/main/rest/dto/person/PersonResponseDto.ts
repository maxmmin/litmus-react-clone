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
import {PersonShortResponseDto} from "./PersonShortResponseDto";
import MetadataContainableResponseDto from "../MetadataContainableResponseDto";
import {FullName} from "../../../model/human/Human";

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

export type RelatedPersonResponseDto = Pick<PersonResponseDto, "id"|"sex"|"media"|"location"|"passportData"|"dateOfBirth"|keyof FullName> & {
    relationshipsInfo: NestedRelationshipsInfo,
    ownedJurPersons: (EmbedJurPersonResponseDto|MinifiedJurPersonResponseDto)[],
    benOwnedJurPersons: (EmbedJurPersonResponseDto|MinifiedJurPersonResponseDto)[],
}

export type NestedRelationshipsInfo = {
    scanOptions: RelationshipsScanOptionsResponseDto,
    relationships: NestedRelationshipResponseDto[]|null
}

export type EmbedPersonResponseDto = PersonShortResponseDto&NestedPersonResponseDto

interface PersonResponseDto extends MetadataContainableResponseDto{
    id: number;
    media: MediaResponseDto;
    firstName: string;
    middleName: string|null;
    lastName: string;
    relationshipsInfo: RelationshipsInfo,
    ownedJurPersons: EmbedJurPersonResponseDto[],
    benOwnedJurPersons: EmbedJurPersonResponseDto[],
    sex: Sex;
    passportData: PassportData;
    dateOfBirth: string | null;
    location: GeoLocation | null
}

export default PersonResponseDto;