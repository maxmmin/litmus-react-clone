import JurPersonResponseDto from "./JurPersonResponseDto";
import {PersonShortResponseDto} from "../person/PersonShortResponseDto";

export type JurPersonSimpleResponseDto = Omit<JurPersonResponseDto, 'owner'|'benOwner'> & {
    owner: PersonShortResponseDto;
    benOwner: PersonShortResponseDto;
}