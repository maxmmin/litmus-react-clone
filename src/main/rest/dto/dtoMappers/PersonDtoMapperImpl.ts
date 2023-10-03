import Person, {Relationship, RelationshipsInfo, RelationshipsScanOptions} from "../../../model/human/person/Person";
import PersonRequestDto, {PassportDataRequestDto, RelationshipRequestDto} from "../person/PersonRequestDto";
import {hasContent} from "../../../util/isEmpty";
import {DateEntityTool} from "../../../model/DateEntity";
import hasMediaContent from "../../../util/media/hasMediaContent";
import PassportData from "../../../model/human/person/PassportData";
import PersonResponseDto, {RelationshipResponseDto, RelationshipsInfoResponseDto} from "../person/PersonResponseDto";
import PersonDtoMapper from "./PersonDtoMapper";

export default class PersonDtoMapperImpl implements PersonDtoMapper {
    static getInstance(): PersonDtoMapperImpl {
        return new PersonDtoMapperImpl();
    }
    mapToRequestDto(emergingPerson: Person): PersonRequestDto {
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
        const dto: RelationshipRequestDto = {}

        if (hasContent(relationship.to)) {
            dto.personId = relationship.to.id;
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

    public mapRelationshipResponseDto (relationshipResponseDto: RelationshipResponseDto): Relationship {
        const linkedPerson = this.mapToEntity(relationshipResponseDto.person);

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

        const relationships = relationshipsInfoResponseDto.relationships?
            relationshipsInfoResponseDto.relationships.map(r=>this.mapRelationshipResponseDto(r))
            :
            [];

        const relationshipsInfo: RelationshipsInfo = {
            scanOptions: options,
            relationships: relationships
        }

        return relationshipsInfo;
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
            id: retrievedEntityDto.id.toString(),
            passportData: passportData,
            sex: retrievedEntityDto.sex,
            location: retrievedEntityDto.location?retrievedEntityDto.location:null,
            firstName: retrievedEntityDto.firstName,
            middleName: retrievedEntityDto.middleName?retrievedEntityDto.middleName:null,
            lastName: retrievedEntityDto.lastName,
            relationshipsInfo: {
                scanOptions: {
                    depth: retrievedEntityDto.relationshipsInfo.scanOptions.depth
                },
                relationships: []
            },
            dateOfBirth: retrievedEntityDto.dateOfBirth&&hasContent(retrievedEntityDto.dateOfBirth)?DateEntityTool.buildFromString(retrievedEntityDto.dateOfBirth):null
        };

        const relationships = retrievedEntityDto.relationshipsInfo.relationships;

        if (relationships&&relationships.length>0) {
            person.relationshipsInfo.relationships = relationships.map(dto=>this.mapRelationshipResponseDto(dto))
        }

        return person;
    }

}