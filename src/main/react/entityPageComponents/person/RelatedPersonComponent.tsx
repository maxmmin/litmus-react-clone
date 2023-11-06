import Person, {Relationship} from "../../../model/human/person/Person";
import React from "react";
import {buildUrl} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";
import {DashedUserIcon, GeoLocationPinDropIcon} from "../../assets/icons";
import {NavLink} from "react-router-dom";
import {Entity} from "../../../model/Entity";
import getFullName from "../../../util/functional/getFullName";
import {valueOrMessage} from "../../../util/functional/valueOrNull";
import {buildJurPersonNavLink, buildPersonNavLink} from "../../../util/navLinkBuilders";

type Props = {
    person: Person,
    cssAnchor?: string,
    containerOnClick?: (person: Person, e: React.MouseEvent<HTMLDivElement>)=>void,
    geoBtnOnClick?: (person: Person, e: React.MouseEvent<HTMLDivElement>)=>void
}

export default function RelatedPersonComponent ({person, cssAnchor="", containerOnClick, geoBtnOnClick}: Props) {
    const mainImg: string|null = person.media.mainImage||person.media.images[0]

    return (
        <div className={`entity-page__related-entity-container entity-page__related-entity-container_possible-related-person ${cssAnchor}`} onClick={
            containerOnClick&&((e)=>containerOnClick(person, e))}>
            <div className="related-entity-container__main-block">
                <div className="related-entity-container__img-wrapper">
                    { mainImg ? <img className={"related-entity-container__img"} src={buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg)} alt="person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
                </div>
                <p className="related-entity-container__entity-name"><NavLink className={"related-entity-container__link link"} to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON],person.id.toString())}>{getFullName(person)}</NavLink></p>
            </div>
            <ul className="related-entity-container__plain-text related-entity-container__plain-text_related-person-relationships">
                {person.relationships.map(r=><li key={r.to.id} className={"related-person-relationships__relationship"}>{buildPersonNavLink(r.to.id,getFullName(r.to))}</li>)}
            </ul>
            <ul className="related-entity-container__plain-text related-entity-container__plain-text_related-person-jur-persons">
                {[...person.ownedJurPersons, ...person.benOwnedJurPersons].map(j=><li key={j.id} className={"related-person-jur-persons__jur=person"}>{buildJurPersonNavLink(j.id,j.name)}</li>)}
            </ul>
            <div className="related-entity-container__location-btn-wrapper" onClick={
                geoBtnOnClick&&(e=>geoBtnOnClick(person, e))
            }>
                <GeoLocationPinDropIcon className={"related-entity-container__location-btn"}/>
            </div>
        </div>
    )
}