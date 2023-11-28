export type ValidationErrors<E> = Record<keyof E, string|null>

export type FieldValidationErrors<E,F extends keyof E> = ValidationErrors<Pick<E, F>>