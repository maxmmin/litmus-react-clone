import Person from "../model/human/person/Person";

export type ValidationErrors<E> = Partial<Record<keyof E, string>>

export type MyType = Person["sex"];

export type FieldValidationErrors<E,F extends keyof E> = ValidationErrors<Pick<E, F>>