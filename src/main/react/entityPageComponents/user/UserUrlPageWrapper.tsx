import {useParams} from "react-router";
import UserPage from "./UserPage";

export default function UserUrlPageWrapper () {
    const {id} = useParams<{id: string}>();

    if (id===undefined||!isNaN(+id)) return <h1>Error. Invalid ID.</h1>

    return <UserPage id={+id}/>
}