import PersonResponseDto from "./PersonResponseDto";

export type PersonShortResponseDto  = Pick<PersonResponseDto, 'id'|'firstName'|'middleName'|'lastName'|'sex'>