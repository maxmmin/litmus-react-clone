import {Permissions} from "../types/Role";
import {AppDispatch} from "../redux/store";
import {clearAuthentication, refreshAccessToken} from "../redux/actions/AuthActions";
import {AuthenticationReducible} from "../types/Authentication";
import jwtDecode, {JwtPayload} from "jwt-decode";
import React from "react";
import {clearAuthRefreshTimer, setTimers, TimersReducible} from "../redux/actions/TimersActions";
import {getGeocode} from "use-places-autocomplete";
import Geo from "../types/Geo";
import {createAuthHeader, gmapsRegionOptions} from "./appConfig";
import {Tables} from "../types/explorationParams";
import {updateExplorationParams} from "../redux/actions/ExplorationParamsActions";
import CreateUserDto from "../types/CreateUserDto";
import CreatePersonDto from "../types/CreatePersonDto";
import CreateJurPersonDto from "../types/CreateJurPersonDto";

function checkAuthorization (neededRights: Permissions[], userRights: Permissions[]): boolean {
    const presentRights = neededRights.filter(right=>userRights.includes(right)?right:null)
    return presentRights.length===neededRights.length;
}
export const createEntity = (url: string, entity: CreateUserDto | CreatePersonDto | CreateJurPersonDto, accessToken: string): Promise<Response> => {
    return fetch(url, {
        headers: {
            ...createAuthHeader(accessToken),
            "content-type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(entity)
    })
}
function logOut(dispatch: AppDispatch) {
    dispatch(clearAuthentication())
}

export const inputGroupsKeyPressHandler = (e: React.KeyboardEvent) => {
    if (e.key==="Enter") {
        e.preventDefault()
        switchNext(e)
    }
}

// condition: div inside container, next container is date container -> label and container with dates inputs
export const inputBeforeDateContainerHandler = (e: React.KeyboardEvent) => {
    if (e.key==="Enter") {
        e.preventDefault()
        const neighbours = Array.from(e.currentTarget.parentNode!.parentNode!.children)
        const input = neighbours[neighbours.indexOf(e.currentTarget.parentElement!)+1].children[1].children[0];
        if (input instanceof HTMLInputElement) {
            input.focus()
        }
    }
}

// it works if all inputs wrapped in containers and these containers have label before input

export const switchNext = (e: React.SyntheticEvent) => {
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
        } else {
            (<HTMLInputElement>e.currentTarget).blur()
        }
    }
}

// it works if there's a group of inputs that aren't wrapped in containers
export const switchNeighbourInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const neighbourElems = Array.from(e.currentTarget.parentNode!.children)
    const currentTargetIndex = neighbourElems.indexOf(e.currentTarget)
    const nextInput = neighbourElems[currentTargetIndex+1]

    if (nextInput instanceof HTMLInputElement) {
        nextInput.focus()
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

export const preventEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key==="Enter") {
        e.preventDefault()
    }
}

export class DateBuilder {
    private day: string = '';

    private month: string = '';

    private year: string = '';

    getDay (): string {
        return this.day;
    }

    getYear (): string {
        return this.year;
    }

    getMonth (): string {
        return this.month;
    }

    setDay (day: string): DateBuilder {
        this.day = day;
        return this;
    }

    setMonth (month: string): DateBuilder {
        this.month = month;
        return this;
    }

    setYear (year: string): DateBuilder {
        this.year = year;
        return this;
    }

    buildStringDate (): string {
        return `${this.year}-${this.month}-${this.day}`
    }

    isValid (): boolean {
        return !isNaN(new Date(`${this.year}-${this.month}-${this.day}`).getTime())
    }
}

export {checkAuthorization, logOut}