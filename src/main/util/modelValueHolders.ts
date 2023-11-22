import {RelationshipsInfo} from "../rest/dto/person/PersonResponseDto";
import Media from "../model/Media";
import PassportData from "../model/human/person/PassportData";

export const blankRelationshipsInfo: RelationshipsInfo = Object.freeze({scanOptions: {depth: 0}, relationships: null})

export const blankMedia: Media  = Object.freeze({mainImage: null, images: []})

export const blankPassportData: PassportData = Object.freeze({passportSerial: null, passportNumber: null, rnokppCode: null})