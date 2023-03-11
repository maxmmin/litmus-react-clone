import {Tables} from "../../types/explorationParams";
import CreatePerson from "./CreatePerson";
import CreateJurPerson from "./CreateJurPerson";
import CreateUser from "./CreateUser";

type Props = {
    table: Tables
}

const CreateInputSection = ({table}: Props) => {
    switch (table) {
        case Tables.PERSONS: return <CreatePerson/>
        case Tables.JUR_PERSONS: return <CreateJurPerson/>
        case Tables.USERS: return <CreateUser/>

        default: return null;
    }
}

export default CreateInputSection