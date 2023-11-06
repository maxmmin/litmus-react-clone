import {NavLink} from "react-router-dom";
import {buildUrl} from "./pureFunctions";
import appConfig from "../config/appConfig";
import {Entity} from "../model/Entity";

export function buildPersonNavLink(id: number, text?: string|JSX.Element, cssAnchor: string = ""): JSX.Element {
    return <NavLink className={"link "+cssAnchor} to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON], id.toString())}>{text||id}</NavLink>
}

export function buildJurPersonNavLink(id: number, text?: string|JSX.Element, cssAnchor: string = ""): JSX.Element {
    return <NavLink className={"link "+cssAnchor} to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.JUR_PERSON], id.toString())}>{text||id}</NavLink>
}
export function buildUserNavLink(id: number, text?: string|JSX.Element, cssAnchor: string = ""): JSX.Element {
    return <NavLink className={"link "+cssAnchor} to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.USER], id.toString())}>{text||id}</NavLink>
}