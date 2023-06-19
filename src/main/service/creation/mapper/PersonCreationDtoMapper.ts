import CreationDtoMapper from "./CreationDtoMapper";
import PersonCreationApiDto , {PassportDataCreationApiDto, RelationshipCreationApiDto} from "./dto/PersonCreationApiDto";
import {hasContent} from "../../../util/isEmpty";
import Person, {Relationship} from "../../../model/human/person/Person";
import PassportData from "../../../model/human/person/PassportData";
import {Location, LocationCreationApiDto} from "../../../model/Location";
import {DateBuilder} from "../../../model/DateEntity";

class PersonCreationDtoMapper implements CreationDtoMapper<Person, PersonCreationApiDto> {
    creationParamsToCreationDto(emergingPerson: Person): PersonCreationApiDto {
        const dto: PersonCreationApiDto = {}

        if (hasContent(emergingPerson.firstName)) {
            dto.firstName = emergingPerson.firstName;
        }

        if (hasContent(emergingPerson.middleName)) {
            dto.middleName = emergingPerson.middleName;
        }

        if (hasContent(emergingPerson.lastName)) {
            dto.lastName = emergingPerson.lastName;
        }

        if (hasContent(emergingPerson.sex)) {
            dto.sex = emergingPerson.sex!;
        }

        if (hasContent(emergingPerson.relationships)&&emergingPerson.relationships.length>0) {
            dto.relationships = emergingPerson.relationships.map(this.getRelationshipDto.bind(this))
        }

        if (hasContent(emergingPerson.passportData)) {
            dto.passportData = this.getPassportDataDto(emergingPerson.passportData!)
        }

        if (hasContent(emergingPerson.location)) {
            dto.location = this.getLocationDto(emergingPerson.location!);
        }

        if (hasContent(emergingPerson.dateOfBirth)) {
            dto.dateOfBirth = DateBuilder.buildStringFrom(emergingPerson.dateOfBirth)
        }

        return dto;
    }

    private getRelationshipDto (relationship: Relationship): RelationshipCreationApiDto {
        const dto: RelationshipCreationApiDto = {}

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

    private getPassportDataDto(passportData: PassportData): PassportDataCreationApiDto {
        const dto: PassportDataCreationApiDto = {}

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

    private getLocationDto(location: Location): LocationCreationApiDto {
        const dto: LocationCreationApiDto = {}

        if (hasContent(location.address)) {
            dto.address = location.address;
        }

        if (hasContent(location.longitude)) {
            dto.longitude = location.longitude;
        }

        if (hasContent(location.latitude)) {
            dto.latitude = location.latitude
        }

        return dto;
    }
}

export default PersonCreationDtoMapper;