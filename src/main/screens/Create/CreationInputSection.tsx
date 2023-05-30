import {Entity} from "../../types/explorationParams";
import CreatePerson from "./person/CreatePerson";
import CreateJurPerson from "./jurperson/CreateJurPerson";
import CreateUser from "./user/CreateUser";

type Props = {
    table: Entity
}

const CreationInputSection = ({table}: Props) => {
    switch (table) {
        case Entity.PERSONS: return <CreatePerson/>
        case Entity.JUR_PERSONS: return <CreateJurPerson/>
        case Entity.USERS: return <CreateUser/>

        default: return null;
    }
}

export default CreationInputSection