import {DateBuilder} from "../../../model/DateEntity";
import isEmpty, {hasContent} from "../../../util/isEmpty";
import CreationDtoMapper from "./CreationDtoMapper";
import JurPersonRequestDto from "../jurPerson/JurPersonRequestDto";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../jurPerson/JurPersonResponseDto";

class JurPersonCreationDtoMapper implements CreationDtoMapper<JurPerson, JurPersonRequestDto, JurPersonResponseDto>{
    public mapToRequestDto (emergingEntity: JurPerson): JurPersonRequestDto {
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

        if (hasContent(emergingEntity.dateOfRegistration)) {
            dto.dateOfRegistration = DateBuilder.buildStringFrom(emergingEntity.dateOfRegistration!);
        }

        if (hasContent(emergingEntity.name)) {
            dto.name = emergingEntity.name;
        }

        return dto;
    }

    mapToEntity(exploredEntityDto: JurPersonResponseDto): JurPerson {
        const jurPerson: JurPerson = {
            id: exploredEntityDto.id,
            name: exploredEntityDto.name,
            owner: exploredEntityDto.owner?exploredEntityDto.owner:null,
            benOwner: exploredEntityDto.benOwner?exploredEntityDto.benOwner:null,
            location: exploredEntityDto.location?exploredEntityDto.location:null,
            dateOfRegistration: hasContent(exploredEntityDto.dateOfRegistration)?DateBuilder.buildFromString(exploredEntityDto.dateOfRegistration!):null,
            edrpou: hasContent(exploredEntityDto.edrpou)?exploredEntityDto.edrpou!:null
        }

        return jurPerson
    }


}

export default JurPersonCreationDtoMapper;