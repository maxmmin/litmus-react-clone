import {JurPerson} from "../../../model/jurPerson/JurPerson";

export type JurPersonShortRequestDto = Pick<JurPerson, 'id'|'name'|'edrpou'>