import {useParams} from "react-router";
import PersonPage from "./PersonPage";

export default function PersonUrlPageWrapper () {
    const {id} = useParams<{id: string}>();

    if (id===undefined||isNaN(+id)) return <h1>Error. Invalid ID.</h1>

    return <PersonPage id={+id}/>
}