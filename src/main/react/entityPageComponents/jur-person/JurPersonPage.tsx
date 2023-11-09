import {useContext, useEffect, useState} from "react";
import {LitmusServiceContext} from "../../App";
import {useParams} from "react-router";
import {BasicHttpError, HttpErrorParser} from "../../../error/BasicHttpError";
import Loader from "../../loader/Loader";
import {PreProcessedJurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonComponent from "./JurPersonComponent";

export default function JurPersonPage () {
    const context = useContext(LitmusServiceContext);
    const explorationApiService = context.exploration.apiService.jurPerson;
    const dtoMapper = context.mappers.jurPerson;
    const notificationManager = context.notification.manager;

    const {id} = useParams<{id: string}>();

    const [isFetching, setFetching] = useState<boolean>(true)

    const [jurPerson,setJurPerson] = useState<PreProcessedJurPerson|null>(null);

    useEffect(()=>{
        if (!isFetching) setFetching(true);

        if (id!==undefined&&!isNaN(+id)) {
            explorationApiService.findByIdWithDepthOption(+id, 12)
                .then(responseDto => {
                    if (responseDto) {
                        const foundPerson = dtoMapper.mapToEntity(responseDto);
                        setJurPerson(foundPerson);
                    }
                })
                .catch(err => {
                    const error = new BasicHttpError(HttpErrorParser.parseError(err));
                    notificationManager.error(error.getDescription())
                })
                .finally(()=>setFetching(false));
        }
    }, [id])

    if (id===undefined) return <h1>Error. Invalid ID.</h1>

    return (
        <div className="entity-root-screen">
            {isFetching && <Loader/>}

            {(!isFetching&&jurPerson) && <JurPersonComponent rawJurPerson={jurPerson}/>}
        </div>
    )
}