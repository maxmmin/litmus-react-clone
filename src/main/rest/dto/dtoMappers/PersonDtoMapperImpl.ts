import Person, {
    RawRelationshipsPerson,
    Relationship
} from "../../../model/human/person/Person";
import PersonRequestDto, {PassportDataRequestDto, RelationshipRequestDto} from "../person/PersonRequestDto";
import {hasContent} from "../../../util/isEmpty";
import {DateEntityTool} from "../../../model/DateEntity";
import hasMediaContent from "../../../util/media/hasMediaContent";
import PassportData from "../../../model/human/person/PassportData";
import PersonResponseDto, {
    RelationshipResponseDto,
} from "../person/PersonResponseDto";
import PersonDtoMapper, {OptionalRawPersonIdMap} from "./PersonDtoMapper";
import {PersonResponseIdMapDto} from "../../../service/exploration/api/human/person/PersonExplorationApiServiceImpl";
import {PersonCreationParams, RelationshipCreationParams} from "../../../service/creation/PersonCreationService";
import {NoRelationshipsPerson} from "../../../redux/types/creation/PersonCreationState";
import deepCopy from "../../../util/deepCopy";

export default class PersonDtoMapperImpl implements PersonDtoMapper {
    static getInstance(): PersonDtoMapperImpl {
        return new PersonDtoMapperImpl();
    }

    mapPersonResponseDtoToNoRelationPerson(dto: Omit<PersonResponseDto, 'relationshipsInfo'>): NoRelationshipsPerson {
        const person: NoRelationshipsPerson = this.mapToEntity({
            ...dto,
            relationshipsInfo: {
                relationships: null,
                scanOptions: {depth: 0}
            }
        });
        // @ts-ignore
        delete person["relationshipsInfo"];
        return {...person}
    }


    mapPersonResponseIdMapDto(dto: PersonResponseIdMapDto): OptionalRawPersonIdMap {
        const personMap: OptionalRawPersonIdMap = new Map<number, RawRelationshipsPerson | null>();

        for (const id in dto) {

            if (isNaN(+id)) throw new Error("invalid id");

            const numId: number = +id;

            const personDto = dto[numId];

            let person: RawRelationshipsPerson|null;

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

    mapToEntity(retrievedEntityDto: PersonResponseDto): RawRelationshipsPerson {
        let passportData: PassportData|null;

        if (retrievedEntityDto.passportData) {
            passportData = {
                rnokppCode: retrievedEntityDto.passportData.rnokppCode||null,
                passportSerial: retrievedEntityDto.passportData.passportSerial||null,
                passportNumber: retrievedEntityDto.passportData.passportNumber||null
            }
        } else passportData = null;

        const person: RawRelationshipsPerson = {
            media: retrievedEntityDto.media,
            id: retrievedEntityDto.id,
            passportData: passportData,
            sex: retrievedEntityDto.sex,
            location: retrievedEntityDto.location||null,
            firstName: retrievedEntityDto.firstName,
            middleName: retrievedEntityDto.middleName||null,
            lastName: retrievedEntityDto.lastName,
            relationshipsInfo: retrievedEntityDto.relationshipsInfo||{scanOptions: {depth: 0}, relationships: []},
            dateOfBirth: retrievedEntityDto.dateOfBirth&&hasContent(retrievedEntityDto.dateOfBirth)?DateEntityTool.buildFromString(retrievedEntityDto.dateOfBirth):null
        };

        return person;
    }

}