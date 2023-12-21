import {useAppSelector} from "../redux/hooks";
import React, {useContext, useEffect, useState} from "react";
import UserPage from "./entityPageComponents/user/UserPage";
import {LitmusServiceContext} from "./App";
import User from "../model/human/user/User";
import {BasicHttpError, HttpErrorParser} from "../error/BasicHttpError";
import Loader from "./loader/Loader";
import UserComponent from "./entityPageComponents/user/UserComponent";

export default function Profile () {
    const context = useContext(LitmusServiceContext);
    const explorationApiService = context.exploration.apiService.user;
    const dtoMapper = context.mappers.user.default;
    const notificationManager = context.notification.manager;

    const [isFetching, setFetching] = useState<boolean>(false);

    const [user, setUser] = useState<User|null>(null)

    useEffect(()=>{
        setFetching(true);

        explorationApiService.findCurrentUser()
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
    }, [])

    return (
        <div className="entity-screen">
            {isFetching && <Loader cssAnchor={"entity-screen-loader"}/>}

            {(!isFetching&&user) && <UserComponent user={user}/>}
        </div>
    )
}