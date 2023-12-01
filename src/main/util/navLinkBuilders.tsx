import {NavLink} from "react-router-dom";
import {buildUrl} from "./pureFunctions";
import appConfig from "../config/appConfig";
import {Entity} from "../model/Entity";
import React, {ReactNode} from "react";
import getFullName from "./functional/getFullName";
import Person from "../model/human/person/Person";
import {FullName} from "../model/human/Human";
import {JurPerson} from "../model/jurPerson/JurPerson";
import User from "../model/human/user/User";

export const LitmusNavLink: React.FC<{
    url: string,
    cssAnchor?: string,
    children: ReactNode
}> = function ({url, cssAnchor = "", children}): JSX.Element {
    return  (
        <NavLink className={"link "+cssAnchor} to={url}>
            {children || url}
        </NavLink>
    )
}

type EntityNavLinkProps = {
    children?: ReactNode,
    cssAnchor?: string
}

export function PersonNavLink ({children, cssAnchor = "", person}: EntityNavLinkProps & {person: Pick<Person, 'id'|keyof FullName>}): JSX.Element {
    return (
        <LitmusNavLink url={buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON], person.id.toString())} cssAnchor={"person-link "+cssAnchor}>
            {children || `ID ${person.id}: ${getFullName(person)}`}
        </LitmusNavLink>
    )
}

export function JurPersonNavLink({cssAnchor = "", jurPerson, children}: EntityNavLinkProps&{jurPerson: Pick<JurPerson, 'id'|'name'>}): JSX.Element {
    return (
        <LitmusNavLink url={buildUrl(appConfig.applicationMappings.entityRoot[Entity.JUR_PERSON], jurPerson.id.toString())} cssAnchor={"jur-person-link "+cssAnchor}>
            {children || `ID ${jurPerson.id}: ${jurPerson.name}}`}
        </LitmusNavLink>
    )
}
export function UserNavLink ({cssAnchor = "", children, user}: EntityNavLinkProps&{user: Pick<User, 'id'|'email'|'role'>}): JSX.Element {
    return (
        <LitmusNavLink url={buildUrl(appConfig.applicationMappings.entityRoot[Entity.USER], user.id.toString())} cssAnchor={"user-link "+cssAnchor}>
            {children || `ID ${user.id}: ${user.email} - ${user.role.canonicalName.toLowerCase()}`}
        </LitmusNavLink>
    )
}