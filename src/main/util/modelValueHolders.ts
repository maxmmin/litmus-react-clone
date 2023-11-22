import {RelationshipsInfo} from "../rest/dto/person/PersonResponseDto";
import Media from "../model/Media";

export const blankRelationshipsInfo: RelationshipsInfo = Object.freeze({scanOptions: {depth: 0}, relationships: null})

export const blankMedia: Media  = Object.freeze({mainImage: null, images: []})