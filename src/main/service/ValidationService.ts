export default interface ValidationService<E> {
    validate(model: E): Partial<Record<keyof E, string>>;
}