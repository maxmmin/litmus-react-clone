import {useAppSelector} from "../redux/hooks";
import React from "react";
import UserPage from "./entityPageComponents/user/UserPage";

export default function Profile () {
    const userId = useAppSelector(state => state.userIdentity?.id)

    if (!userId) throw new Error("no current user authenticated");

    return <UserPage id={userId} />
}