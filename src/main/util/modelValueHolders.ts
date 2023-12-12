import {RelationshipsInfo} from "../rest/dto/person/PersonResponseDto";
import Media from "../model/Media";
import PassportData from "../model/human/person/PassportData";
import {CreatedEntities} from "../model/human/user/User";
import {Metadata} from "../model/MetadataContainable";

export const blankRelationshipsInfo: RelationshipsInfo = Object.freeze({scanOptions: {depth: 0}, relationships: null})

export const blankMedia: Media  = Object.freeze({mainImage: null, images: []})

export const blankPassportData: PassportData = Object.freeze({passportSerial: null, passportNumber: null, rnokppCode: null})

export const blankCreatedEntities: CreatedEntities = Object.freeze({persons: [], jurPersons: [], users: []})

export const blankMetadata: Metadata = Object.freeze({updatedAt: 0, createdAt: 0, updatedBy: null, createdBy: null})

