import {DateEntityTool} from "../../../model/DateEntity";
import {hasContent} from "../../../util/isEmpty";
import DtoMapper from "./DtoMapper";
import JurPersonRequestDto from "../jurPerson/JurPersonRequestDto";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../jurPerson/JurPersonResponseDto";

class JurPersonDtoMapper implements DtoMapper<JurPersonRequestDto, JurPerson, JurPersonResponseDto>{
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

        if (emergingEntity.dateOfRegistration&&hasContent(emergingEntity.dateOfRegistration)) {
            dto.dateOfRegistration = DateEntityTool.getStringFrom(emergingEntity.dateOfRegistration!);
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
            dateOfRegistration: hasContent(exploredEntityDto.dateOfRegistration)?DateEntityTool.buildFromString(exploredEntityDto.dateOfRegistration!):null,
            edrpou: hasContent(exploredEntityDto.edrpou)?exploredEntityDto.edrpou!:null
        }

        return jurPerson
    }


}

export default JurPersonDtoMapper;