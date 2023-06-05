import CreatePerson from "./person/CreatePerson";
import CreateJurPerson from "./jurperson/CreateJurPerson";
import CreateUser from "./user/CreateUser";
import {Entity} from "../../redux/exploration/Entity";

type Props = {
    table: Entity
}

const CreationInputSection = ({table}: Props) => {
    switch (table) {
        case Entity.PERSON: return <CreatePerson/>
        case Entity.JUR_PERSON: return <CreateJurPerson/>
        case Entity.USER: return <CreateUser/>

        default: return null;
    }
}

export default CreationInputSection