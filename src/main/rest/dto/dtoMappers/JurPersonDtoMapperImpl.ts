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

class JurPersonDtoMapperImpl implements JurPersonDtoMapper {
    static getInstance(): JurPersonDtoMapperImpl {
        return new JurPersonDtoMapperImpl();
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
        console.log(exploredEntityDto);

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
            edrpou: hasContent(exploredEntityDto.edrpou)?exploredEntityDto.edrpou!:"",
            media: media
        }

        return jurPerson;
    }
}

export default JurPersonDtoMapperImpl;