import {useContext, useEffect, useState} from "react";
import {LitmusServiceContext} from "../../App";
import {BasicHttpError, HttpErrorParser} from "../../../error/BasicHttpError";
import User from "../../../model/human/user/User";
import UserComponent from "./UserComponent";
import Loader from "../../loader/Loader";
import {PageProps} from "../PageProps";

export default function UserPage ({id}: PageProps) {
    const context = useContext(LitmusServiceContext);
    const explorationApiService = context.exploration.apiService.user;
    const dtoMapper = context.mappers.user.default;
    const notificationManager = context.notification.manager;

    const [isFetching, setFetching] = useState<boolean>(true);

    const [user, setUser] = useState<User|null>(null)

    useEffect(()=>{
        if (!isFetching) {
            setFetching(true);

            explorationApiService.findById(id)
                .then(responseDto => {
                    if (responseDto) {
                        const foundUser = dtoMapper.mapToEntity(responseDto);
                        console.log(foundUser)
                        setUser(foundUser);
                    }
                })
                .catch(err => {
                    console.error(err)
                    const error = new BasicHttpError(HttpErrorParser.parseError(err));
                    notificationManager.error(error.getDescription())
                })
                .finally(()=>setFetching(false));
        }
    }, [id, isFetching])

    return (
        <div className="entity-root-screen">
            {isFetching && <Loader/>}

            {(!isFetching&&user) && <UserComponent user={user}/>}
        </div>
    )
}