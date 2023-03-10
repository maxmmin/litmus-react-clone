import {Permissions} from "../types/Role";
import store, {AppDispatch} from "../redux/store";
import {clearAuthentication, refreshAccessToken} from "../redux/actions/AuthActions";
import Authentication, {AuthenticationReducible} from "../types/Authentication";
import jwtDecode, {JwtPayload} from "jwt-decode";
import React from "react";

function checkAuthorization (neededRights: Permissions[], userRights: Permissions[]): boolean {
    const presentRights = neededRights.filter(right=>userRights.includes(right)?right:null)
    return presentRights.length===neededRights.length;
}

function logOut(dispatch: AppDispatch) {
    dispatch(clearAuthentication())
}

export const searchInputGroupsKeyPressHandler = (e: React.KeyboardEvent) => {
    if (e.key==="Enter") {
        e.preventDefault()
        const neighbourElems = Array.from(e.currentTarget.parentNode!.parentNode!.children)
        const currentTargetIndex = neighbourElems.indexOf(e.currentTarget!.parentElement!)

        if (!isNaN(currentTargetIndex)&&currentTargetIndex>-1) {
            const nextElem = neighbourElems[currentTargetIndex+1]
            if (nextElem instanceof HTMLDivElement) {
                const supposedInput = nextElem.children[1]
                if (supposedInput instanceof HTMLInputElement) {
                    supposedInput.focus()
                }
            } else if (nextElem instanceof HTMLButtonElement) {
                nextElem.click()
            }
        }
    }
}

export const checkAndRefreshAuth = (auth: AuthenticationReducible, dispatch: AppDispatch) => {
            if (auth) {
                if (isInvalid(auth.accessToken!)) {
                    if (auth.refreshToken&&!isInvalid(auth.refreshToken)) {
                        return dispatch(
                             refreshAccessToken(auth.refreshToken)
                        )
                    } else {
                        return logOut(dispatch)
                    }
                }
                return;
            }
}

export function isInvalid(token: string | null | undefined): boolean {
        try {
            if (token) {
                return jwtDecode<JwtPayload>(token).exp!*1000<Date.now();
            }
        } catch (e) {
            console.error(e)
        }
        return true;
}

export const updateAuthentication = (accessToken: string, refreshToken: string, dispatch: AppDispatch): NodeJS.Timer => {
    const expirationTimeInMs = jwtDecode<JwtPayload>(accessToken).exp! * 1000;
    const refreshCallbackDelayInMs = expirationTimeInMs - Date.now()/1000 - 500

    const expDate = new Date(expirationTimeInMs);

    console.log(`auth update planned in ${expDate.getHours()}:${expDate.getMinutes()}`)

    // this callback will fire when it will 1 minute before jwt expiring
    return setTimeout(()=>{
        console.log("updating auth")
        dispatch(refreshAccessToken(refreshToken))
    }, refreshCallbackDelayInMs)
}


export {checkAuthorization, logOut,}