import React from "react";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {buildUrl} from "../../util/pureFunctions";
import appConfig from "../../config/appConfig";
import {DashedUserIcon, GeoLocationPinDropIcon} from "../assets/icons";
import {NavLink} from "react-router-dom";
import {Entity} from "../../model/Entity";
import getFullName from "../../util/functional/getFullName";
import {valueOrMessage} from "../../util/functional/valueOrNull";
import SecuredImage from "../sharedComponents/SecuredImage";

type RelatedJurPersonProps = {
    jurPerson: JurPerson,
    cssAnchor?: string,
    containerOnClick?: (jurPerson: JurPerson, e: React.MouseEvent<HTMLDivElement>)=>void,
    geoBtnOnClick?: (jurPerson: JurPerson, e: React.MouseEvent<HTMLDivElement>)=>void
}

export default function ({jurPerson, cssAnchor="", containerOnClick, geoBtnOnClick}: RelatedJurPersonProps) {
    const mainImg: string|null = jurPerson.media.mainImage||jurPerson.media.images[0]
    const ownerLink = jurPerson.owner&&<NavLink
        className={"related-entity-container__link link"}
        to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON], jurPerson.owner.id.toString())}>{getFullName(jurPerson.owner)}</NavLink>
    const benOwnerLink  = jurPerson.benOwner&&<NavLink
        className={"related-entity-container__link link"}
        to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON], jurPerson.benOwner.id.toString())}>{getFullName(jurPerson.benOwner)}</NavLink>
    return (
        <div className={`entity-page__related-entity-container entity-page__related-entity-container_jur-person ${cssAnchor}`} onClick={
            containerOnClick&&((e)=>containerOnClick(jurPerson, e))}>
            <div className="related-entity-container__main-block">
                <div className="related-entity-container__img-wrapper">
                    { mainImg ? <SecuredImage className={"related-entity-container__img"} src={buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg)} alt="jur-person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
                </div>
                <p className="related-entity-container__entity-name"><NavLink className={"related-entity-container__link link"} to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.JUR_PERSON],jurPerson.id.toString())}>{jurPerson.name}</NavLink></p>
            </div>
            <p className="related-entity-container__plain-text related-entity-container__plain-text_owner">{valueOrMessage(ownerLink)}</p>
            <p className="related-entity-container__plain-text related-entity-container__plain-text_ben-owner">{valueOrMessage(benOwnerLink)}</p>
            <div className="related-entity-container__location-btn-wrapper" onClick={
                geoBtnOnClick&&(e=>geoBtnOnClick(jurPerson, e))
            }>
                <GeoLocationPinDropIcon className={"related-entity-container__location-btn"}/>
            </div>
        </div>
    )
}