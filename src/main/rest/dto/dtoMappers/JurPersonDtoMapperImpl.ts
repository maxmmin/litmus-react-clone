import DateEntity, {DateEntityTool} from "../../../model/DateEntity";
import {hasContent} from "../../../util/functional/isEmpty";
import JurPersonRequestDto from "../jurPerson/JurPersonRequestDto";
import {JurPerson, PreProcessedJurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonResponseDto, {EmbedJurPersonResponseDto} from "../jurPerson/JurPersonResponseDto";
import JurPersonDtoMapper from "./JurPersonDtoMapper";
import {JurPersonCreationParams} from "../../../redux/types/creation/JurPersonCreationState";
import hasMediaContent from "../../../util/media/hasMediaContent";
import Media from "../../../model/Media";
import Person from "../../../model/human/person/Person";
import {JurPersonSimpleResponseDto} from "../jurPerson/JurPersonSimpleResponseDto";
import {RelatedPersonResponseDto} from "../person/PersonResponseDto";
import {PersonShortResponseDto} from "../person/PersonShortResponseDto";
import Sex from "../../../model/human/person/Sex";
import {blankMedia, blankPassportData, blankRelationshipsInfo} from "../../../util/modelValueHolders";

class JurPersonDtoMapperImpl implements JurPersonDtoMapper {
    static getInstance(): JurPersonDtoMapperImpl {
        return new JurPersonDtoMapperImpl();
    }

    private mapShortPersonDtoToRelated (dto: PersonShortResponseDto): RelatedPersonResponseDto {
        return {
            id: dto.id,
            firstName: dto.firstName,
            middleName: dto.middleName,
            lastName: dto.lastName,
            sex: Sex.UNKNOWN,
            media: blankMedia,
            location: null,
            relationshipsInfo: blankRelationshipsInfo,
            passportData: blankPassportData,
            dateOfBirth: null,
            ownedJurPersons: [],
            benOwnedJurPersons: []
        }
    }

    mapSimpleDtoToEntity(simpleDto: JurPersonSimpleResponseDto): PreProcessedJurPerson {
        const media: Media = {
            mainImage: simpleDto.media.mainImage,
            images: simpleDto.media.images||[]
        }

        return {
            id: simpleDto.id,
            name: simpleDto.name,
            owner: simpleDto.owner?this.mapShortPersonDtoToRelated(simpleDto.owner):null,
            benOwner: simpleDto.benOwner?this.mapShortPersonDtoToRelated(simpleDto.benOwner):null,
            location: simpleDto.location,
            dateOfRegistration: hasContent(simpleDto.dateOfRegistration)?DateEntityTool.buildFromString(simpleDto.dateOfRegistration!):null,
            edrpou: hasContent(simpleDto.edrpou)?simpleDto.edrpou:null,
            media: media
        };
    }

    public mapToRequestDto (emergingEntity: JurPersonCreationParams): JurPersonRequestDto {
        const dto: Partial<JurPersonRequestDto> = {};

        if (hasContent(emergingEntity.benOwner)) {
            dto.benOwnerId = emergingEntity.benOwner!.id;
        }

        if (hasContent(emergingEntity.owner)) {
            dto.ownerId = emergingEntity.owner!.id;
        }

        if (hasContent(emergingEntity.edrpou)) {
            dto.edrpou = emergingEntity.edrpou!;
        }

        if (hasContent(emergingEntity.location)) {
            dto.location = emergingEntity.location!;
        }

        if (emergingEntity.dateOfRegistration&&hasContent(emergingEntity.dateOfRegistration)) {
            dto.dateOfRegistration = DateEntityTool.getStringFrom(emergingEntity.dateOfRegistration!);
        }

        if (hasContent(emergingEntity.name)) {
            dto.name = emergingEntity.name;
        }

        if (hasMediaContent(emergingEntity.media)) {
            dto.media = emergingEntity.media;
        }

        return dto;
    }

    mapToEntity(exploredEntityDto: JurPersonResponseDto): PreProcessedJurPerson {
        const media: Media = {
            mainImage: exploredEntityDto.media.mainImage,
            images: exploredEntityDto.media.images||[]
        }

        const jurPerson: PreProcessedJurPerson = {
            id: exploredEntityDto.id,
            name: exploredEntityDto.name,
            owner: exploredEntityDto.owner,
            benOwner: exploredEntityDto.benOwner,
            location: exploredEntityDto.location,
            dateOfRegistration: hasContent(exploredEntityDto.dateOfRegistration)?DateEntityTool.buildFromString(exploredEntityDto.dateOfRegistration!):null,
            edrpou: hasContent(exploredEntityDto.edrpou)?exploredEntityDto.edrpou!:"",
            media: media
        }

        return jurPerson;
    }

    mapToRipeJurPerson(exploredEntityDto: Omit<PreProcessedJurPerson|EmbedJurPersonResponseDto, 'owner'|'benOwner'>, owner: Person|null, benOwner: Person|null): JurPerson {

        const media: Media = {
            mainImage: exploredEntityDto.media.mainImage,
            images: exploredEntityDto.media.images||[]
        }

        let dob: DateEntity|null = null;
        if (exploredEntityDto.dateOfRegistration) {
            if (typeof exploredEntityDto.dateOfRegistration === 'string') {
                dob = DateEntityTool.buildFromString(exploredEntityDto.dateOfRegistration);
            } else dob = exploredEntityDto.dateOfRegistration;
        }

        const jurPerson: JurPerson = {
            id: exploredEntityDto.id,
            name: exploredEntityDto.name,
            owner: owner,
            benOwner: benOwner,
            location: exploredEntityDto.location,
            dateOfRegistration: dob,
            edrpou: hasContent(exploredEntityDto.edrpou)?exploredEntityDto.edrpou:null,
            media: media
        }

        return jurPerson;
    }
}

export default JurPersonDtoMapperImpl;