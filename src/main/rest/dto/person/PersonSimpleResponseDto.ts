import PersonResponseDto from "./PersonResponseDto";

export type PersonSimpleResponseDto = Omit<PersonResponseDto, "relationshipsInfo"|"ownedJurPersons"|"benOwnedJurPersons">