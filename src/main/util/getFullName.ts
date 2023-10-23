import Human, {FullName} from "../model/human/Human";

const getFullName = (human: Pick<Human, keyof FullName>) => {
    return `${human.lastName} ${human.firstName} ${human.middleName||""}`.trim()
}

export default getFullName;