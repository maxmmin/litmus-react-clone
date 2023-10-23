import {GeoLocation} from "../../GeoLocation";
import DateEntity from "../../DateEntity";
import Sex from "./Sex";
import PassportData from "./PassportData";
import Human, {FullName} from "../Human";
import MediaEntity from "../../MediaEntity";
import CoreEntity from "../../CoreEntity";
import {RelationshipCreationParams} from "../../../service/creation/PersonCreationService";
import {RelationshipsInfoResponseDto} from "../../../rest/dto/person/PersonResponseDto";
import {NoRelationshipsPerson} from "../../../redux/types/creation/PersonCreationState";

export type RelationshipsScanOptions = {
    depth: number
}

interface Person extends Human, MediaEntity, CoreEntity {
    relationships: Relationship[],
    sex: Sex | null;
    passportData: PassportData | null;
    dateOfBirth: DateEntity | null;
    location: GeoLocation | null
}

export type RawRelationshipsPerson = NoRelationshipsPerson&{
    relationshipsInfo: RelationshipsInfoResponseDto
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