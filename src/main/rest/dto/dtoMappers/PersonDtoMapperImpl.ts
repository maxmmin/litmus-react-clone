import Person, {
    NestedPerson,
    NestedRelationship, NestedRelationshipsInfo,
    Relationship,
    RelationshipsInfo,
    RelationshipsScanOptions
} from "../../../model/human/person/Person";
import PersonRequestDto, {PassportDataRequestDto, RelationshipRequestDto} from "../person/PersonRequestDto";
import {hasContent} from "../../../util/isEmpty";
import {DateEntityTool} from "../../../model/DateEntity";
import hasMediaContent from "../../../util/media/hasMediaContent";
import PassportData from "../../../model/human/person/PassportData";
import PersonResponseDto, {
    NestedPersonResponseDto,
    NestedRelationshipResponseDto, NestedRelationshipsInfoResponseDto,
    RelatedPersonResponseDto,
    RelationshipResponseDto,
    RelationshipsInfoResponseDto
} from "../person/PersonResponseDto";
import PersonDtoMapper from "./PersonDtoMapper";
import {PersonResponseIdMapDto} from "../../../service/exploration/api/human/person/PersonExplorationApiServiceImpl";
import {PersonIdMap, OptionalPersonIdMap} from "../../../service/relationships/BasicPersonRelationshipsAnalyzer";
import {PersonCreationParams} from "../../../service/creation/PersonCreationService";

export default class PersonDtoMapperImpl implements PersonDtoMapper {
    static getInstance(): PersonDtoMapperImpl {
        return new PersonDtoMapperImpl();
    }

    mapPersonToNestedPerson(person: Person): NestedPerson {
        let relationshipsInfo: NestedRelationshipsInfo|undefined = person.nestedRelationshipsInfo;
        if (!relationshipsInfo) {
           throw new Error("person has no nested relationships info")
        }

        const nested: NestedPerson = {
            id: person.id,
            relationshipsInfo: relationshipsInfo
        }

        return nested;
    }

    mapPersonResponseIdMapDto(dto: PersonResponseIdMapDto): OptionalPersonIdMap {
        const personMap: OptionalPersonIdMap = new Map<number, Person | null>();

        for (const id in dto) {

            if (isNaN(+id)) throw new Error("invalid id");

            const numId: number = +id;

            const personDto = dto[numId];

            let person: Person|null;

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

        if (emergingPerson.relationshipsInfo.relationships.length>0) {
            dto.relationships = emergingPerson.relationshipsInfo.relationships.map(this.getRelationshipRequestDto.bind(this))
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

    private getRelationshipRequestDto (relationship: Relationship): RelationshipRequestDto {
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

    private relatedToPersonResponseDto (dto: RelatedPersonResponseDto): PersonResponseDto {
        return {...dto, relationshipsInfo: {
                scanOptions: {
                    depth: 0
                },
                relationships: null
            }}
    }

    public mapRelationshipResponseDto (relationshipResponseDto: RelationshipResponseDto): Relationship {
        const linkedPersonDto = this.relatedToPersonResponseDto(relationshipResponseDto.person);
        const linkedPerson = this.mapToEntity(linkedPersonDto);

        return {
            note: relationshipResponseDto.note,
            type: relationshipResponseDto.type,
            to: linkedPerson
        }
    }

    public mapRelationshipsInfoResponseDto(relationshipsInfoResponseDto: RelationshipsInfoResponseDto): RelationshipsInfo {
        const options: RelationshipsScanOptions = {
            depth: relationshipsInfoResponseDto.scanOptions.depth
        };

        let relationships: Relationship[] = []

        if (relationshipsInfoResponseDto.relationships) {
            relationships = relationshipsInfoResponseDto.relationships.map(r=>this.mapRelationshipResponseDto(r))
        }

        return  {
            scanOptions: options,
            relationships: relationships
        }
    }

    private mapNestedPersonResponseDto(dto: NestedPersonResponseDto): NestedPerson {
        return {
            id: dto.id,
            relationshipsInfo: this.mapNestedRelationshipsInfoResponseDto(dto.relationshipsInfo)
        }
    }

    private mapNestedRelationshipResponseDto(relationshipDto: NestedRelationshipResponseDto): NestedRelationship {
        const nestedPerson: NestedPerson = this.mapNestedPersonResponseDto(relationshipDto.person);
        return {
            note: relationshipDto.note,
            type: relationshipDto.type,
            to: nestedPerson
        }
    }

    private mapNestedRelationshipsInfoResponseDto(relationshipsInfoResponseDto: NestedRelationshipsInfoResponseDto): NestedRelationshipsInfo {
        let nestedRelationships: NestedRelationship[] = []
        if (relationshipsInfoResponseDto.scanOptions.depth>0
            &&
            relationshipsInfoResponseDto.relationships
            &&
            relationshipsInfoResponseDto.relationships.length>0) {
                nestedRelationships = relationshipsInfoResponseDto.relationships.map(r=>this.mapNestedRelationshipResponseDto(r))
        }

        return {
            scanOptions: {
                depth: relationshipsInfoResponseDto.scanOptions.depth
            },
            relationships: nestedRelationships
        }
    }

    private personResponseDtoToNestedPersonResponseDto(dto: PersonResponseDto|RelatedPersonResponseDto): NestedPersonResponseDto {
        let nestedRelationships: NestedRelationshipsInfoResponseDto['relationships'] = null;

        if (dto.relationshipsInfo.relationships) {
            nestedRelationships = dto.relationshipsInfo.relationships.map(r => {
                const nested: NestedRelationshipResponseDto = {
                    ...r,
                    person: {
                        id: r.person.id, relationshipsInfo: {
                            scanOptions: r.person.relationshipsInfo.scanOptions,
                            relationships: r.person.relationshipsInfo.relationships
                        }
                    }
                }
                return nested;
            })
        }
        return {
            id: dto.id,
            relationshipsInfo: {
                scanOptions: dto.relationshipsInfo.scanOptions,
                relationships: nestedRelationships
            }
        }
    }


    private mapRelationshipsInfoResponseDtoToNestedInfo(relationshipsInfoResponseDto: RelationshipsInfoResponseDto): NestedRelationshipsInfo {
        const options: RelationshipsScanOptions = {
            depth: relationshipsInfoResponseDto.scanOptions.depth
        };

        let relationships: NestedRelationship[] = []

        if (relationshipsInfoResponseDto.relationships) {
            relationships = relationshipsInfoResponseDto.relationships.map(r=>this.mapNestedRelationshipResponseDto({
                ...r,
                person: this.personResponseDtoToNestedPersonResponseDto(r.person)
            }))
        }

        return  {
            scanOptions: options,
            relationships: relationships
        }
    }

    mapToEntity(retrievedEntityDto: PersonResponseDto): Person {
        let passportData: PassportData|null;

        if (retrievedEntityDto.passportData) {
            passportData = {
                rnokppCode: retrievedEntityDto.passportData.rnokppCode?retrievedEntityDto.passportData.rnokppCode:null,
                passportSerial: retrievedEntityDto.passportData.passportSerial?retrievedEntityDto.passportData.passportSerial:null,
                passportNumber: retrievedEntityDto.passportData.passportNumber?retrievedEntityDto.passportData.passportNumber:null
            }
        } else passportData = null;

        const person: Person = {
            media: retrievedEntityDto.media?retrievedEntityDto.media:{images: [], mainImage: null},
            id: retrievedEntityDto.id,
            passportData: passportData,
            sex: retrievedEntityDto.sex,
            location: retrievedEntityDto.location?retrievedEntityDto.location:null,
            firstName: retrievedEntityDto.firstName,
            middleName: retrievedEntityDto.middleName?retrievedEntityDto.middleName:null,
            lastName: retrievedEntityDto.lastName,
            relationshipsInfo: this.mapRelationshipsInfoResponseDto(retrievedEntityDto.relationshipsInfo),
            dateOfBirth: retrievedEntityDto.dateOfBirth&&hasContent(retrievedEntityDto.dateOfBirth)?DateEntityTool.buildFromString(retrievedEntityDto.dateOfBirth):null
        };

        person.nestedRelationshipsInfo = this.mapRelationshipsInfoResponseDtoToNestedInfo(retrievedEntityDto.relationshipsInfo);

        return person;
    }

}