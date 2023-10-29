import {SimplePersonResponseDto} from "../../rest/dto/person/PersonResponseDto";

type Props = {
    person: SimplePersonResponseDto
}
export default function ({person}: Props) {
    return (
        <h1>{person.lastName}</h1>
    )
}