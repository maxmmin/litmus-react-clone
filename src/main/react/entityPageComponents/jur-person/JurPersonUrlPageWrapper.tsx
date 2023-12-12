import {useParams} from "react-router";
import React from "react";
import JurPersonPage from "./JurPersonPage";

export default function JurPersonUrlPageWrapper () {
    const {id} = useParams<{id: string}>();

    if (id===undefined||isNaN(+id)) return <h1>Error. Invalid ID.</h1>

    return <JurPersonPage id={+id}/>

}