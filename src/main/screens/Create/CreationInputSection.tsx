import {Tables} from "../../types/explorationParams";
import CreatePerson from "./person/CreatePerson";
import CreateJurPerson from "./jurperson/CreateJurPerson";
import CreateUser from "./user/CreateUser";

type Props = {
    table: Tables
}

const CreationInputSection = ({table}: Props) => {
    switch (table) {
        case Tables.PERSONS: return <CreatePerson/>
        case Tables.JUR_PERSONS: return <CreateJurPerson/>
        case Tables.USERS: return <CreateUser/>

        default: return null;
    }
}

export default CreationInputSection