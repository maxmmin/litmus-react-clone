import {useContext, useEffect, useState} from "react";
import {LitmusServiceContext} from "../../App";
import {useParams} from "react-router";
import {BasicHttpError, HttpErrorParser} from "../../../error/BasicHttpError";
import Loader from "../../loader/Loader";
import {PreProcessedJurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonComponent from "./JurPersonComponent";
import {PageProps} from "../PageProps";

export default function JurPersonPage ({id}: PageProps) {
    const context = useContext(LitmusServiceContext);
    const explorationApiService = context.exploration.apiService.jurPerson;
    const dtoMapper = context.mappers.jurPerson;
    const notificationManager = context.notification.manager;

    const [isFetching, setFetching] = useState<boolean>(false)

    const [jurPerson,setJurPerson] = useState<PreProcessedJurPerson|null>(null);

    useEffect(()=>{
        setFetching(true);

        explorationApiService.findByIdWithDepthOption(id, 12)
            .then(responseDto => {
                if (responseDto) {
                    const foundPerson = dtoMapper.mapToEntity(responseDto);
                    setJurPerson(foundPerson);
                }
            })
            .catch(err => {
                console.error(err)
                const error = new BasicHttpError(HttpErrorParser.parseError(err));
                notificationManager.error(error.getDescription())
            })
            .finally(()=>setFetching(false));
    }, [id])

    return (
        <div className="entity-screen">
            {isFetching && <Loader cssAnchor={"entity-screen-loader"}/>}

            {(!isFetching&&jurPerson) && <JurPersonComponent rawJurPerson={jurPerson}/>}
        </div>
    )
}