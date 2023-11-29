import {useContext, useEffect, useState} from "react";
import {LitmusServiceContext} from "../../App";
import {useParams} from "react-router";
import {BasicHttpError, HttpErrorParser} from "../../../error/BasicHttpError";
import User from "../../../model/human/user/User";
import UserComponent from "./UserComponent";
import Loader from "../../loader/Loader";

export default function UserPage () {
    const context = useContext(LitmusServiceContext);
    const explorationApiService = context.exploration.apiService.user;
    const dtoMapper = context.mappers.user.default;
    const notificationManager = context.notification.manager;

    const {id} = useParams<{id: string}>();

    const [isFetching, setFetching] = useState<boolean>(true);

    const [user, setUser] = useState<User|null>(null)

    useEffect(()=>{
        if (!isFetching) setFetching(true);

        if (id!==undefined&&!isNaN(+id)) {
            explorationApiService.findById(+id)
                .then(responseDto => {
                    if (responseDto) {
                        const foundPerson = dtoMapper.mapToEntity(responseDto);
                        setUser(foundPerson);
                    }
                })
                .catch(err => {
                    console.error(err)
                    const error = new BasicHttpError(HttpErrorParser.parseError(err));
                    notificationManager.error(error.getDescription())
                })
                .finally(()=>setFetching(false));
        }
    }, [id])

    return (
        <div className="entity-root-screen">
            {isFetching && <Loader/>}

            {(!isFetching&&user) && <UserComponent user={user}/>}
        </div>
    )
}