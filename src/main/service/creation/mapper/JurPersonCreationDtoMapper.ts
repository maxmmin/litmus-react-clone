import {DateBuilder} from "../../../model/DateEntity";
import isEmpty from "../../../util/isEmpty";
import CreationDtoMapper from "./CreationDtoMapper";
import JurPersonCreationApiDto from "./dto/JurPersonCreationApiDto";
import {JurPerson} from "../../../model/jurPerson/JurPerson";

class JurPersonCreationDtoMapper implements CreationDtoMapper<JurPerson, JurPersonCreationApiDto>{
    public creationParamsToCreationDto (params: JurPerson): JurPersonCreationApiDto {
        const dto: Partial<JurPersonCreationApiDto> = {};

        if (!isEmpty(params.benOwner)) {
            dto.benOwnerId = params.benOwner!.id;
        }

        if (!isEmpty(params.owner)) {
            dto.ownerId = params.owner!.id;
        }

        if (!isEmpty(params.edrpou)) {
            dto.edrpou = params.edrpou;
        }

        if (!isEmpty(params.location)) {
            dto.location = params.location!;
        }

        if (!isEmpty(params.dateOfRegistration)) {
            dto.dateOfRegistration = DateBuilder.buildStringFrom(params.dateOfRegistration);
        }

        if (!isEmpty(params.name)) {
            dto.name = params.name;
        }

        return dto;
    }
}

export default JurPersonCreationDtoMapper;