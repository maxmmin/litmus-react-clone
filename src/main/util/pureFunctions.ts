import {Permission} from "../redux/types/userIdentity/Role";
import React from "react";
import appConfig from "../config/appConfig";
import {Entity} from "../model/Entity";
import {Action} from "redux";
import {GeoLocation} from "../model/GeoLocation";


function checkAuthorization (neededRights: Permission[], userRights: Permission[]): boolean {
    const presentRights = neededRights.filter(right=>userRights.includes(right)?right:null)
    return presentRights.length===neededRights.length;
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

export {checkAuthorization}

type NotNullOrUndefined<T> = T extends null | undefined ? never : T;

export function checkNotEmpty <T> (arg: T): NotNullOrUndefined<T> {
    if (arg===null||arg===undefined) {
        throw new Error("empty arg")
    } else return arg as NotNullOrUndefined<T>;
}

export function hasValue <T> (arg: T|undefined|null): arg is T {
    return arg!==null&&arg!==undefined;
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

export function hasLocation<T extends {location?: GeoLocation|null}>(object: T): object is T&{location: GeoLocation} {
    return Boolean(object.location);
}

export function buildImgUrl(imagePath: string) {
    return buildUrl(appConfig.serverMappings.mediaRootUrl,imagePath)
}
