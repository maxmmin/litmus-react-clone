import DtoMapper from "./DtoMapper";
import JurPersonRequestDto from "../jurPerson/JurPersonRequestDto";
import {JurPerson, PreProcessedEmbedJurPerson, PreProcessedJurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonResponseDto, {EmbedJurPersonResponseDto} from "../jurPerson/JurPersonResponseDto";
import {JurPersonCreationParams} from "../../../redux/types/creation/JurPersonCreationState";

export default interface JurPersonDtoMapper extends DtoMapper<JurPersonRequestDto, PreProcessedJurPerson, JurPersonResponseDto, JurPersonCreationParams> {
    mapEmbedResponseDto(dto: EmbedJurPersonResponseDto): PreProcessedEmbedJurPerson;
}