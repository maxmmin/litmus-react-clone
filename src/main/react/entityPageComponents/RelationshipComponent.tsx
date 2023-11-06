import {Relationship} from "../../model/human/person/Person";
import React from "react";
import {buildUrl} from "../../util/pureFunctions";
import appConfig from "../../config/appConfig";
import {DashedUserIcon, GeoLocationPinDropIcon} from "../assets/icons";
import {NavLink} from "react-router-dom";
import {Entity} from "../../model/Entity";
import getFullName from "../../util/functional/getFullName";
import {valueOrMessage} from "../../util/functional/valueOrNull";

type RelationShipProps = {
    relationship: Relationship,
    cssAnchor?: string,
    containerOnClick?: (relationship: Relationship, e: React.MouseEvent<HTMLDivElement>)=>void,
    geoBtnOnClick?: (relationship: Relationship, e: React.MouseEvent<HTMLDivElement>)=>void
}

export default function RelationshipComponent ({relationship, cssAnchor="", containerOnClick, geoBtnOnClick}: RelationShipProps) {
    const person = relationship.to

    const mainImg: string|null = person.media.mainImage||person.media.images[0]

    return (
        <div className={`entity-page__related-entity-container entity-page__related-entity-container_relationship ${cssAnchor}`} onClick={
            containerOnClick&&((e)=>containerOnClick(relationship, e))}>
            <div className="related-entity-container__main-block">
                <div className="related-entity-container__img-wrapper">
                    { mainImg ? <img className={"related-entity-container__img"} src={buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg)} alt="person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
                </div>
                <p className="related-entity-container__entity-name"><NavLink className={"related-entity-container__link link"} to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON],person.id.toString())}>{getFullName(person)}</NavLink></p>
            </div>
            <p className="related-entity-container__plain-text related-entity-container__plain-text_relation-type">{relationship.type}</p>
            <p className="related-entity-container__plain-text related-entity-container__plain-text_relation-note">{valueOrMessage(relationship.note)}</p>
            <div className="related-entity-container__location-btn-wrapper" onClick={
                geoBtnOnClick&&(e=>geoBtnOnClick(relationship, e))
            }>
                <GeoLocationPinDropIcon className={"related-entity-container__location-btn"}/>
            </div>
        </div>
    )
}