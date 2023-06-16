import CreatePerson from "./person/CreatePerson";
import CreateJurPerson from "./jurperson/CreateJurPerson";
import CreateUser from "./user/CreateUser";
import {Entity} from "../../model/Entity";

type Props = {
    entity: Entity
}

const CreationInputSection = ({entity}: Props) => {
    switch (entity) {
        case Entity.PERSON: return <CreatePerson/>
        case Entity.JUR_PERSON: return <CreateJurPerson/>
        case Entity.USER: return <CreateUser/>

        default: return null;
    }
}

export default CreationInputSection