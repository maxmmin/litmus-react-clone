import {EmbedJurPersonResponseDto, MinifiedJurPersonResponseDto} from "../rest/dto/jurPerson/JurPersonResponseDto";

export default function checkJurPersonDto(j: EmbedJurPersonResponseDto|MinifiedJurPersonResponseDto): j is EmbedJurPersonResponseDto {
    return Object.hasOwn(j,"owner")&&Object.hasOwn(j,"benOwner");
}
