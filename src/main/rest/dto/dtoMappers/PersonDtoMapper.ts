import DtoMapper from "./DtoMapper";
import PersonRequestDto , {PassportDataRequestDto, RelationshipRequestDto} from "../person/PersonRequestDto";
import {hasContent} from "../../../util/isEmpty";
import Person, {Relationship} from "../../../model/human/person/Person";
import PassportData from "../../../model/human/person/PassportData";
import {DateEntityTool} from "../../../model/DateEntity";
import PersonResponseDto from "../person/PersonResponseDto";


class PersonDtoMapper implements DtoMapper<PersonRequestDto, Person, PersonResponseDto> {
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

        if (emergingPerson.relationships&&emergingPerson.relationships.length>0) {
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

        return dto;
    }

    private getRelationshipRequestDto (relationship: Relationship): RelationshipRequestDto {
        const dto: RelationshipRequestDto = {}

        if (hasContent(relationship.person)) {
            dto.personId = relationship.person.id;
        }

        if (hasContent(relationship.relationType)) {
            dto.type = relationship.relationType!;
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
            media: retrievedEntityDto.media,
            id: retrievedEntityDto.id,
            passportData: passportData,
            sex: retrievedEntityDto.sex,
            location: retrievedEntityDto.location?retrievedEntityDto.location:null,
            firstName: retrievedEntityDto.firstName,
            middleName: retrievedEntityDto.middleName?retrievedEntityDto.middleName:null,
            lastName: retrievedEntityDto.lastName,
            relationships: retrievedEntityDto.relationships?retrievedEntityDto.relationships:[],
            dateOfBirth: retrievedEntityDto.dateOfBirth&&hasContent(retrievedEntityDto.dateOfBirth)?DateEntityTool.buildFromString(retrievedEntityDto.dateOfBirth):null
        };

        return person;
    }


}

export default PersonDtoMapper;