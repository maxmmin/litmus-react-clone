import Person, {PreProcessedPerson, Relationship} from "../../../model/human/person/Person";
import PersonRequestDto, {PassportDataRequestDto, RelationshipRequestDto} from "../../../rest/dto/person/PersonRequestDto";
import {hasContent} from "../../../util/functional/validation/isEmpty";
import {DateEntityTool} from "../../../model/DateEntity";
import hasMediaContent from "../../../util/media/hasMediaContent";
import PassportData from "../../../model/human/person/PassportData";
import PersonResponseDto, {
    EmbedPersonResponseDto,
    RelationshipResponseDto
} from "../../../rest/dto/person/PersonResponseDto";
import PersonDtoMapper, {OptionalRawPersonIdMap} from "./PersonDtoMapper";
import {PersonCreationParams, RelationshipCreationParams} from "../../coreServices/creation/PersonCreationService";
import {PersonSimpleResponseDto} from "../../../rest/dto/person/PersonSimpleResponseDto";
import {blankMedia, blankMetadata, blankPassportData, blankRelationshipsInfo} from "../../../util/modelValueHolders";
import {PersonResponseIdMapDto} from "../../api/person/exploration/PersonExplorationApiService";
import {PersonShortResponseDto} from "../../../rest/dto/person/PersonShortResponseDto";
import MetadataDtoMapper from "../metadata/MetadataDtoMapper";
import MetadataDtoMapperImpl from "../metadata/MetadataDtoMapperImpl";


export default class PersonDtoMapperImpl implements PersonDtoMapper {

    protected readonly metadataDtoMapper: MetadataDtoMapper;


    constructor(metadataDtoMapper: MetadataDtoMapper) {
        this.metadataDtoMapper = metadataDtoMapper;
    }

    static getInstance(metadataDtoMapper: MetadataDtoMapper = MetadataDtoMapperImpl.getInstance()): PersonDtoMapperImpl {
        return new PersonDtoMapperImpl(metadataDtoMapper);
    }

    mapSimpleDtoToEntity(simpleDto: PersonSimpleResponseDto): PreProcessedPerson {
        return {...simpleDto,
            ownedJurPersons: [],
            benOwnedJurPersons: [],
            dateOfBirth: simpleDto.dateOfBirth&&hasContent(simpleDto.dateOfBirth)?DateEntityTool.buildFromString(simpleDto.dateOfBirth):null,
            relationshipsInfo: {...blankRelationshipsInfo},
            metadata: {...blankMetadata},
            sources: simpleDto.sources
        }
    }

    mapPreProcessedPersonWithLoss(preProcessed: Omit<PreProcessedPerson, "ownedJurPersons" | "benOwnedJurPersons" | "relationshipsInfo">): Person {
        return {
            id: preProcessed.id,
            media: preProcessed.media,
            passportData: preProcessed.passportData,
            location: preProcessed.location,
            firstName: preProcessed.firstName,
            middleName: preProcessed.middleName,
            lastName: preProcessed.lastName,
            benOwnedJurPersons: [],
            ownedJurPersons: [],
            relationships: [],
            dateOfBirth: preProcessed.dateOfBirth,
            sex: preProcessed.sex,
            metadata: preProcessed.metadata,
            sources: preProcessed.sources
        }
    }

    mapEmbedPersonResponseDto(dto: EmbedPersonResponseDto): PreProcessedPerson {
        return {
            id: dto.id,
            media: {...blankMedia},
            passportData: null,
            location: null,
            firstName: dto.firstName,
            middleName: dto.middleName,
            lastName: dto.lastName,
            dateOfBirth: null,
            sex: dto.sex,
            ownedJurPersons: [],
            benOwnedJurPersons: [],
            relationshipsInfo: {...blankRelationshipsInfo},
            metadata: {...blankMetadata},
            sources: []
        };
    }

    mapShortDtoToEntity(shortDto: PersonShortResponseDto): PreProcessedPerson {
        return {
            id: shortDto.id,
            firstName: shortDto.firstName,
            middleName: shortDto.middleName,
            lastName: shortDto.lastName,
            sex: shortDto.sex,
            passportData: {...blankPassportData},
            media: {...blankMedia},
            location: null,
            dateOfBirth: null,
            relationshipsInfo: {...blankRelationshipsInfo},
            benOwnedJurPersons: [],
            ownedJurPersons: [],
            metadata: {...blankMetadata},
            sources: []
        }
    }

    mapPersonResponseIdMapDto(dto: PersonResponseIdMapDto): OptionalRawPersonIdMap {
        const personMap: OptionalRawPersonIdMap = new Map<number, PreProcessedPerson|null>();

        for (const id in dto) {

            if (isNaN(+id)) throw new Error("invalid id");

            const numId: number = +id;

            const personDto = dto[numId];

            let person: PreProcessedPerson|null;

            if (personDto) {
                person = this.mapToEntity(personDto);
            } else person = null;

            personMap.set(numId, person);
        }

        return personMap;
    }

    mapToRequestDto(emergingPerson: PersonCreationParams): PersonRequestDto {
        const dto: PersonRequestDto = {}

        if (emergingPerson.firstName&&hasContent(emergingPerson.firstName)) {
            dto.firstName = emergingPerson.firstName;
        }

        if (emergingPerson.middleName&&hasContent(emergingPerson.middleName)) {
            dto.middleName = emergingPerson.middleName;
        }

        if (emergingPerson.lastName&&hasContent(emergingPerson.lastName)) {
            dto.lastName = emergingPerson.lastName;
        }

        if (emergingPerson.sex) {
            dto.sex = emergingPerson.sex;
        }

        if (emergingPerson.relationships.length>0) {
            dto.relationships = emergingPerson.relationships.map(this.getRelationshipRequestDto.bind(this))
        }

        if (emergingPerson.passportData) {
            dto.passportData = this.getPassportDataRequestDto(emergingPerson.passportData)
        }

        if (emergingPerson.location) {
            dto.location = emergingPerson.location;
        }

        if (emergingPerson.dateOfBirth&&hasContent(emergingPerson.dateOfBirth)) {
            dto.dateOfBirth = DateEntityTool.getStringFrom(emergingPerson.dateOfBirth)
        }
        if (hasMediaContent(emergingPerson.media)) {
            dto.media = emergingPerson.media;
        }

        return dto;
    }

    private getRelationshipRequestDto (relationship: RelationshipCreationParams): RelationshipRequestDto {
        const dto: RelationshipRequestDto = {
            personId: relationship.to.id
        }

        if (hasContent(relationship.type)) {
            dto.type = relationship.type!;
        }

        if (hasContent(relationship.note)) {
            dto.note = relationship.note;
        }

        return dto;
    }

    private getPassportDataRequestDto(passportData: PassportData): PassportDataRequestDto {
        const dto: PassportDataRequestDto = {}

        if (hasContent(passportData.passportNumber)) {
            dto.passportNumber = passportData.passportNumber!;
        }

        if (hasContent(passportData.passportSerial)) {
            dto.passportSerial = passportData.passportSerial!;
        }

        if (hasContent(passportData.rnokppCode)) {
            dto.rnokppCode = passportData.rnokppCode!;
        }

        return dto;
    }

    public mapRelationshipResponseDto (relationshipResponseDto: Omit<RelationshipResponseDto, 'person'>, to: Person): Relationship {
        return {
            note: relationshipResponseDto.note,
            type: relationshipResponseDto.type,
            to: to
        }
    }

    mapToEntity(retrievedEntityDto: PersonResponseDto): PreProcessedPerson {
        const person: PreProcessedPerson = {
            media: retrievedEntityDto.media,
            id: retrievedEntityDto.id,
            passportData: retrievedEntityDto.passportData,
            sex: retrievedEntityDto.sex,
            ownedJurPersons: retrievedEntityDto.ownedJurPersons,
            benOwnedJurPersons: retrievedEntityDto.benOwnedJurPersons,
            location: retrievedEntityDto.location||null,
            firstName: retrievedEntityDto.firstName,
            middleName: retrievedEntityDto.middleName||null,
            lastName: retrievedEntityDto.lastName,
            relationshipsInfo: retrievedEntityDto.relationshipsInfo||{scanOptions: {depth: 0}, relationships: []},
            dateOfBirth: retrievedEntityDto.dateOfBirth&&hasContent(retrievedEntityDto.dateOfBirth)?
                DateEntityTool.buildFromString(retrievedEntityDto.dateOfBirth):null,
            metadata: this.metadataDtoMapper.map(retrievedEntityDto.metadata),
            sources: retrievedEntityDto.sources
        };

        return person;
    }

}