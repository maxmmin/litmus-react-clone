export default interface Mapper<S,T> {
    map(obj: S): T;
}