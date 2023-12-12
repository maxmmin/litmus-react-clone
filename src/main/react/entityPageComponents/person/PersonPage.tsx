import {PreProcessedPerson} from "../../../model/human/person/Person";
import {useContext, useEffect, useState} from "react";
import {LitmusServiceContext} from "../../App";
import {BasicHttpError, HttpErrorParser} from "../../../error/BasicHttpError";
import Loader from "../../loader/Loader";
import PersonComponent from "./PersonComponent";
import {PageProps} from "../PageProps";

export default function PersonPage ({id}: PageProps) {
    const context = useContext(LitmusServiceContext);
    const explorationApiService = context.exploration.apiService.person;
    const dtoMapper = context.mappers.person;
    const notificationManager = context.notification.manager;

    const [isFetching, setFetching] = useState<boolean>(false)

    const [person,setPerson] = useState<PreProcessedPerson|null>(null);

    useEffect(()=>{
        setFetching(true);

        explorationApiService.findByIdWithDepthOption(id, 12)
            .then(responseDto => {
                if (responseDto) {
                    const foundPerson = dtoMapper.mapToEntity(responseDto);
                    setPerson(foundPerson);
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

            {(!isFetching&&person) && <PersonComponent rawPerson={person}/>}
        </div>
    )
}