import {GeoLocation} from "../../GeoLocation";
import DateEntity from "../../DateEntity";
import Sex from "./Sex";
import PassportData from "./PassportData";
import Human from "../Human";
import MediaEntity from "../../MediaEntity";
import CoreEntity from "../../CoreEntity";
import {NestedRelationshipsInfo, RelationshipsInfo} from "../../../rest/dto/person/PersonResponseDto";
import {JurPerson} from "../../jurPerson/JurPerson";
import {EmbedJurPersonResponseDto} from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import SourceContainableEntity from "../../SourceContainableEntity";

interface Person extends Human, MediaEntity, CoreEntity, SourceContainableEntity {
    relationships: Relationship[],
    ownedJurPersons: JurPerson[],
    benOwnedJurPersons: JurPerson[],
    sex: Sex;
    passportData: PassportData | null;
    dateOfBirth: DateEntity | null;
    location: GeoLocation | null;
}

export type NoRelationsPerson = Omit<Person, 'relationships'|'ownedJurPersons'|'benOwnedJurPersons'>

export type PreProcessedPerson = Omit<Person, 'relationships'|'ownedJurPersons'|'benOwnedJurPersons'>&{
    relationshipsInfo: RelationshipsInfo,
    ownedJurPersons: EmbedJurPersonResponseDto[],
    benOwnedJurPersons: EmbedJurPersonResponseDto[]
}

export type Relationship = {
    to: Person,
    type: RelationType,
    note: string | null
}

export enum RelationType {
    PARENT="PARENT", SPOUSE="SPOUSE", SIBLING="SIBLING", RELATIVE="RELATIVE", FRIEND="FRIEND", CHILD="CHILD", UNSET="UNSET"
}

export default Person;