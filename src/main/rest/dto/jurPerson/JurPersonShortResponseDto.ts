import {JurPerson} from "../../../model/jurPerson/JurPerson";

export type JurPersonShortResponseDto = Pick<JurPerson, 'id'|'name'|'edrpou'>