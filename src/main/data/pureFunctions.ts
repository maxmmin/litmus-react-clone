import {Permissions} from "../types/Role";
import {AppDispatch} from "../redux/store";
import {clearAuthentication, refreshAccessKey} from "../redux/actions/AuthActions";
import AuthenticationType from "../types/AuthenticationType";
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

export const checkAndRefreshAuth = (auth: AuthenticationType, dispatch: AppDispatch) => {
            if (auth) {
                if (isInvalid(auth.accessToken!)) {
                    if (auth.refreshToken&&!isInvalid(auth.refreshToken)) {
                        return dispatch(
                             refreshAccessKey(auth.refreshToken)
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

export {checkAuthorization, logOut,}