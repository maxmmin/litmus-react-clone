import {Permissions} from "../types/Role";
import {AppDispatch} from "../redux/store";
import {clearAuthentication, refreshAccessToken} from "../redux/actions/AuthActions";
import {AuthenticationReducible} from "../types/Authentication";
import jwtDecode, {JwtPayload} from "jwt-decode";
import React from "react";
import {clearAuthRefreshTimer, setTimers, TimersReducible} from "../redux/actions/TimersActions";
import {getGeocode} from "use-places-autocomplete";
import Geo from "../types/Geo";
import {gmapsRegionOptions} from "./appConfig";
import {Tables} from "../types/explorationParams";
import {updateExplorationParams} from "../redux/actions/ExplorationParamsActions";

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

export const getTableNameFromLocation = (pathName: string): Tables | null => {
    const path = pathName.endsWith("/")?pathName.slice(0,-1):pathName;
    const pathsArray = path.split("/")
    const table = pathsArray[pathsArray.length-1].toUpperCase() as Tables | null
    return table;
}

export const checkAndRefreshAuth = (auth: AuthenticationReducible,timers: TimersReducible, dispatch: AppDispatch) => {
    if (auth) {
        if (isInvalid(auth?.accessToken!)) {

            if (auth?.refreshToken&&!isInvalid(auth.refreshToken)) {
                return dispatch(
                    refreshAccessToken({refreshToken: auth.refreshToken, shouldRefreshGlobally: false})
                )
            } else {
                return logOut(dispatch)
            }
        }

        if (!timers?.authRefreshTimerId&&auth?.accessToken&&auth.refreshToken) {
            return dispatch(setTimers({authRefreshTimerId: setAuthRefreshingTimer(auth, dispatch)}))
        }
    }

    if (!auth&&timers?.authRefreshTimerId) {
        window.clearTimeout(timers.authRefreshTimerId)
        dispatch(clearAuthRefreshTimer())
    }

    return;
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

export const setAuthRefreshingTimer = (authentication: AuthenticationReducible, dispatch: AppDispatch): NodeJS.Timer | null => {
    const accessToken = authentication?.accessToken!;
    const refreshToken = authentication?.refreshToken!;

    let expirationTimeInMs;

    try {
        expirationTimeInMs = jwtDecode<JwtPayload>(accessToken).exp! * 1000;
    } catch (e) {
        console.log(e)
        return null;
    }

    const refreshCallbackDelayInMs = expirationTimeInMs - Date.now() - 1000*60;

    const expDate = new Date(expirationTimeInMs-1000*60);

    console.log(`auth update planned in ${expDate.getHours()}:${expDate.getMinutes()}:${expDate.getSeconds()}`)

    // this callback will fire when it will 1 minute before jwt expiring
    return setTimeout(()=>{
        console.log("updating auth")
        dispatch(refreshAccessToken({refreshToken: refreshToken, shouldRefreshGlobally: false}))
    }, refreshCallbackDelayInMs)
}

export const onWakeUp = (callback: Function): NodeJS.Timer => {
    const TIMEOUT = 20000;
    let lastTime = (new Date()).getTime();

    return setInterval(function() {
        const currentTime = (new Date()).getTime();
        if (currentTime > (lastTime + TIMEOUT + 2000)) {
            callback()
        }
        lastTime = currentTime;
    }, TIMEOUT);
}

export const geocode = async (geoData: Geo|string) => {
    const requestArgs:  google.maps.GeocoderRequest = {}

    if (typeof geoData==="string") {
        requestArgs.address = geoData;
    }   else {
        requestArgs.location = {
            lat: geoData.lat,
            lng: geoData.lng
        }
    }

    return await getGeocode({
        ...requestArgs,
        ...gmapsRegionOptions
    })
}

export {checkAuthorization, logOut}