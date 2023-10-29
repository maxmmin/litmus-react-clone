import {GeoLocation} from "../../GeoLocation";
import DateEntity from "../../DateEntity";
import Sex from "./Sex";
import PassportData from "./PassportData";
import Human from "../Human";
import MediaEntity from "../../MediaEntity";
import CoreEntity from "../../CoreEntity";
import {NestedRelationshipsInfo, RelationshipsInfo} from "../../../rest/dto/person/PersonResponseDto";
import {JurPerson, PreProcessedJurPerson} from "../../jurPerson/JurPerson";
import {EmbedJurPersonResponseDto} from "../../../rest/dto/jurPerson/JurPersonResponseDto";

export type RelationshipsScanOptions = {
    depth: number
}

interface Person extends Human, MediaEntity, CoreEntity {
    relationships: Relationship[],
    ownedJurPersons: JurPerson[],
    benOwnedJurPersons: JurPerson[],
    sex: Sex;
    passportData: PassportData | null;
    dateOfBirth: DateEntity | null;
    location: GeoLocation | null
}

export type PreProcessedPerson = Omit<Person, 'relationships'|'ownedJurPersons'|'benOwnedJurPersons'>&{
    relationshipsInfo: RelationshipsInfo,
    ownedJurPersons: EmbedJurPersonResponseDto[],
    benOwnedJurPersons: EmbedJurPersonResponseDto[]
}

export type PreProcessedEmbedPerson = Omit<PreProcessedPerson, 'relationshipsInfo'>&{
    relationshipsInfo: NestedRelationshipsInfo
}

export type Relationship = {
    to: Person,
    type: RelationType | null,
    note: string
}

export enum RelationType {
    PARENT="PARENT", SPOUSE="SPOUSE", SIBLING="SIBLING", RELATIVE="RELATIVE", FRIEND="FRIEND"
}

export default Person;