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
import {PersonNavLink} from "../../util/navLinkBuilders";

type RelatedJurPersonProps = {
    jurPerson: JurPerson,
    cssAnchor?: string,
    containerOnClick?: (jurPerson: JurPerson, e: React.MouseEvent<HTMLDivElement>)=>void,
    geoBtnOnClick?: (jurPerson: JurPerson, e: React.MouseEvent<HTMLDivElement>)=>void
}

export default function RelatedJurPersonComponent ({jurPerson, cssAnchor="", containerOnClick, geoBtnOnClick}: RelatedJurPersonProps) {
    const mainImg: string|null = jurPerson.media.mainImage||jurPerson.media.images[0]
    const ownerLink = jurPerson.owner && <PersonNavLink person={jurPerson.owner}>{getFullName(jurPerson.owner)}</PersonNavLink>
    const benOwnerLink  = jurPerson.benOwner && <PersonNavLink person={jurPerson.benOwner}>{getFullName(jurPerson.benOwner)}</PersonNavLink>
    return (
        <div className={`entity-page__related-entity-container entity-page__related-entity-container_jur-person ${cssAnchor}`} onClick={
            containerOnClick&&((e)=>containerOnClick(jurPerson, e))}>
            <div className="related-entity-container__main-block related-entity-container__main-block_jur-person">
                <div className="related-entity-container__img-wrapper related-entity-container__img-wrapper_jur-person">
                    { mainImg ? <SecuredImage className={"related-entity-container__img"} src={buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg)} alt="jur-person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
                </div>
                <p className="related-entity-container__entity-name"><NavLink className={"related-entity-container__link link"} to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.JUR_PERSON],jurPerson.id.toString())}>{jurPerson.name}</NavLink></p>
            </div>
            <p className="related-entity-container__plain-text related-entity-container__plain-text_owner">
                <span className={"related-entity-container__mobile-key related-entity-container__mobile-key_br"}>Власник: </span> {valueOrMessage(ownerLink)}
            </p>
            <p className="related-entity-container__plain-text related-entity-container__plain-text_ben-owner">
                <span className={"related-entity-container__mobile-key related-entity-container__mobile-key_br"}>Бенефіціарний власник: </span> {valueOrMessage(benOwnerLink)}
            </p>
            <div className="related-entity-container__location-btn-wrapper" onClick={
                geoBtnOnClick&&(e=>geoBtnOnClick(jurPerson, e))
            }>
                <GeoLocationPinDropIcon className={"related-entity-container__location-btn"}/>
            </div>
        </div>
    )
}