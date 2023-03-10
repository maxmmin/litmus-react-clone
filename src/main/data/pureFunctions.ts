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

<<<<<<< HEAD
export const updateAuthentication = (accessToken: string, refreshToken: string): NodeJS.Timer => {
    const refreshTime = jwtDecode<JwtPayload>(accessToken).exp! - (Date.now()/1000)

    console.log(`auth update planned in ${refreshTime} seconds`)

    // this callback will fire when it will 1 minute before jwt expiring
    return setTimeout(()=>{
        console.log("updating auth")
        store.dispatch(refreshAccessToken(refreshToken))
    }, (refreshTime-30)*1000)
}


=======
export const setRefreshAuthTimer = (accessToken: string, refreshToken: string, dispatch: AppDispatch) => {
    const expirationTimeInMs = jwtDecode<JwtPayload>(accessToken).exp!*1000;
    const refreshWaitInMs = expirationTimeInMs - Date.now()

    const expDate = new Date(expirationTimeInMs)

    console.log(`auth will be updated at ${expDate.getHours()}:${expDate.getMinutes()}`)
    return setTimeout(()=>{
        dispatch(refreshAccessToken(refreshToken))
    }, refreshWaitInMs-500)
}
// @todo write setup this timeout on web application load
>>>>>>> 4ea8153 (auth fix)
export {checkAuthorization, logOut,}