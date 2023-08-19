import {Permissions} from "../redux/types/userIdentity/Role";
import {AppDispatch} from "../redux/store";
import {clearAuthentication} from "../redux/actions/AuthAction";
import jwtDecode, {JwtPayload} from "jwt-decode";
import React from "react";
import {getGeocode} from "use-places-autocomplete";
import GeoCoordinates from "../model/GeoCoordinates";
import appConfig, {gmapsRegionOptions} from "../config/appConfig";
import {Entity} from "../model/Entity";
import {Action} from "redux";


function checkAuthorization (neededRights: Permissions[], userRights: Permissions[]): boolean {
    const presentRights = neededRights.filter(right=>userRights.includes(right)?right:null)
    return presentRights.length===neededRights.length;
}


// export const createEntity = (url: string, entity: CreateUserDto | CreatePersonDto | CreateJurPersonDto, accessToken: string): Promise<Response> => {
//     return fetch(url, {
//         headers: {
//             ...createAuthHeader(accessToken),
//             "content-type": "application/json"
//         },
//         method: 'POST',
//         body: JSON.stringify(entity)
//     })
// }
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

export const getTableNameFromLocation = (pathName: string): Entity | null => {
    const path = pathName.endsWith("/")?pathName.slice(0,-1):pathName;
    const pathsArray = path.split("/")
    return pathsArray[pathsArray.length - 1].toUpperCase() as Entity | null;
}

// export const checkAndRefreshAuth = (core: AuthenticationReducible,timers: TimersReducible, dispatch: AppDispatch) => {
//     if (core) {
//         if (!isValid(core?.accessToken!)) {
//             if (core?.refreshToken&&isValid(core.refreshToken)) {
//                 return dispatch(
//                     refreshAccessToken({refreshToken: core.refreshToken, globalPending: false, notifyOnEnd: false})
//                 )
//             } else {
//                 return logOut(dispatch)
//             }
//         }
//
//         if (!timers?.authRefreshTimerId&&core?.accessToken&&core.refreshToken) {
//             return dispatch(setTimers({authRefreshTimerId: setAuthRefreshingTimer(core, dispatch)}))
//         }
//     }
//
//     if (!core&&timers?.authRefreshTimerId) {
//         window.clearTimeout(timers.authRefreshTimerId)
//         dispatch(clearAuthRefreshTimer())
//     }
//
//     return;
// }

export function isValid(token: string | null | undefined): boolean {
        try {
            if (token) {
                return !(jwtDecode<JwtPayload>(token).exp!*1000<Date.now());
            }
        } catch (e) {
            console.error(e)
        }
        return false;
}

// export const setAuthRefreshingTimer = (authentication: AuthenticationReducible, dispatch: AppDispatch): NodeJS.Timer | null => {
//     const accessToken = authentication?.accessToken!;
//     const refreshToken = authentication?.refreshToken!;
//
//     let expirationTimeInMs;
//
//     try {
//         expirationTimeInMs = jwtDecode<JwtPayload>(accessToken).exp! * 1000;
//     } catch (e) {
//         console.log(e)
//         return null;
//     }
//
//     const refreshCallbackDelayInMs = expirationTimeInMs - Date.now() - 1000*60;
//
//     const expDate = new Date(expirationTimeInMs-1000*60);
//
//     console.log(`core update planned in ${expDate.getHours()}:${expDate.getMinutes()}:${expDate.getSeconds()}`)
//
//     // this callback will fire when it will 1 minute before jwt expiring
//     return setTimeout(()=>{
//         console.log("updating core")
//         dispatch(refreshAccessToken({refreshToken: refreshToken, globalPending: false, notifyOnEnd: false}))
//     }, refreshCallbackDelayInMs)
// }

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

export const geocode = async (geoData: GeoCoordinates|string) => {
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

export const isActionRejected = (action: Action<String>) => {
    return action.type.endsWith("/rejected");
}

export const isActionFulfilled = (action: Action<String>) => {
    return action.type.endsWith("/fulfilled");
}

export const isActionPending = (action: Action<String>) => {
    return action.type.endsWith("/pending")
}

export {checkAuthorization, logOut}

export function checkNotEmpty <T> (arg: T) {
    if (arg===null||arg===undefined) {
        throw new Error("unset arg exception")
    } else return arg;
}

export function generateRandomString(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
}

export function buildUrl(...args: string[]): string {
    return args.map((part, index)=>{
        if (part.endsWith("/")) {
            part = part.slice(0, -1)
        }
        if (part.startsWith("/")&&index!==0) {
            part = part.slice(1)
        }
        return part;
    }).join("/")
}


export function getEntityByDomain (domain: string): Entity|null {
    let entity: Entity|null = null;

    Object.entries(appConfig.entityDomains).forEach(([key, value])=>{
        if (domain===value) {
            entity = Entity[key as Entity];
        }
    })

    return entity;
}