import DateEntity, {DateEntityTool} from "../../../model/DateEntity";
import {hasContent} from "../../../util/functional/isEmpty";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import {JurPerson, PreProcessedJurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonResponseDto, {EmbedJurPersonResponseDto} from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import JurPersonDtoMapper from "./JurPersonDtoMapper";
import {JurPersonCreationParams} from "../../../redux/types/creation/JurPersonCreationState";
import hasMediaContent from "../../../util/media/hasMediaContent";
import Media from "../../../model/Media";
import Person from "../../../model/human/person/Person";
import {JurPersonSimpleResponseDto} from "../../../rest/dto/jurPerson/JurPersonSimpleResponseDto";
import {RelatedPersonResponseDto} from "../../../rest/dto/person/PersonResponseDto";
import {PersonShortResponseDto} from "../../../rest/dto/person/PersonShortResponseDto";
import Sex from "../../../model/human/person/Sex";
import {blankMedia, blankMetadata, blankPassportData, blankRelationshipsInfo} from "../../../util/modelValueHolders";
import PersonDtoMapper from "../person/PersonDtoMapper";
import PersonDtoMapperImpl from "../person/PersonDtoMapperImpl";
import {JurPersonShortResponseDto} from "../../../rest/dto/jurPerson/JurPersonShortResponseDto";
import MetadataDtoMapper from "../metadata/MetadataDtoMapper";
import MetadataDtoMapperImpl from "../metadata/MetadataDtoMapperImpl";
import {Metadata} from "../../../model/MetadataContainable";

class JurPersonDtoMapperImpl implements JurPersonDtoMapper {

    protected readonly personDtoMapper: PersonDtoMapper;

    protected readonly metadataDtoMapper: MetadataDtoMapper

    constructor(personDtoMapper: PersonDtoMapper,
                metadataDtoMapper: MetadataDtoMapper) {
        this.personDtoMapper = personDtoMapper;
        this.metadataDtoMapper = metadataDtoMapper;
    }

    static getInstance(personDtoMapper: PersonDtoMapper = PersonDtoMapperImpl.getInstance(),
                       metadataDtoMapper: MetadataDtoMapper = MetadataDtoMapperImpl.getInstance()): JurPersonDtoMapperImpl {
        return new JurPersonDtoMapperImpl(personDtoMapper, metadataDtoMapper);
    }

    mapPreprocessedJurPersonWithLoss(dto: PreProcessedJurPerson): JurPerson {
        const owner: Person|null = dto.owner?this.personDtoMapper.mapPreProcessedPersonWithLoss(this.personDtoMapper.mapSimpleDtoToEntity(dto.owner)):null;
        const benOwner: Person|null = dto.benOwner?this.personDtoMapper.mapPreProcessedPersonWithLoss(this.personDtoMapper.mapSimpleDtoToEntity(dto.benOwner)):null;
        return this.mapToRipeJurPerson(dto, owner, benOwner);
    }



    private mapShortPersonDtoToRelated (dto: PersonShortResponseDto): RelatedPersonResponseDto {
        return {
            id: dto.id,
            firstName: dto.firstName,
            middleName: dto.middleName,
            lastName: dto.lastName,
            sex: Sex.UNKNOWN,
            media: {...blankMedia},
            location: null,
            relationshipsInfo: {...blankRelationshipsInfo},
            passportData: {...blankPassportData},
            dateOfBirth: null,
            ownedJurPersons: [],
            benOwnedJurPersons: []
        }
    }

    mapShortDtoToEntity(shortDto: JurPersonShortResponseDto): PreProcessedJurPerson {
        return {
            id: shortDto.id,
            edrpou: shortDto.edrpou,
            name: shortDto.name,
            owner: null,
            benOwner: null,
            media: {...blankMedia},
            dateOfRegistration: null,
            location: null,
            metadata: {...blankMetadata}
        };
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
            media: media,
            metadata: {...blankMetadata}
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
            media: media,
            metadata: this.metadataDtoMapper.map(exploredEntityDto.metadata)
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

        let metadata: Metadata = {...blankMetadata};
        if (Object.hasOwn(exploredEntityDto, "metadata")) {
            metadata = (exploredEntityDto as PreProcessedJurPerson).metadata;
        }

        const jurPerson: JurPerson = {
            id: exploredEntityDto.id,
            name: exploredEntityDto.name,
            owner: owner,
            benOwner: benOwner,
            location: exploredEntityDto.location,
            dateOfRegistration: dob,
            edrpou: hasContent(exploredEntityDto.edrpou)?exploredEntityDto.edrpou:null,
            media: media,
            metadata: metadata
        }

        return jurPerson;
    }
}

export default JurPersonDtoMapperImpl;