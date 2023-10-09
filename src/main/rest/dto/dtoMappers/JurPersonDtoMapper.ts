import DtoMapper from "./DtoMapper";
import JurPersonRequestDto from "../jurPerson/JurPersonRequestDto";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../jurPerson/JurPersonResponseDto";
import {JurPersonCreationParams} from "../../../redux/types/creation/JurPersonCreationState";

export default interface JurPersonDtoMapper extends DtoMapper<JurPersonRequestDto, JurPerson, JurPersonResponseDto, JurPersonCreationParams> {

}