import Person, {getFullName, Relationship} from "../../model/human/person/Person";
import {buildUrl} from "../../util/pureFunctions";
import appConfig from "../../config/appConfig";
import {valueOrMessage} from "../../util/valueOrNull";
import {DateEntityTool} from "../../model/DateEntity";
import "../../css/entityPage/entityPage.scss";
import "../../css/entityPage/personPage.scss";
import {DashedUserIcon, GeoLocationPinDropIcon} from "../../util/icons";
import ImageSlider from "./ImageSlider";
import PersonMap from "./PersonMap";
import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {Entity} from "../../model/Entity";
import {GeoLocation} from "../../model/GeoLocation";

type PersonProps = {
    person: Person
}

type RelationShipProps = {
    relationship: Relationship,
    cssAnchor?: string,
    containerOnClick?: (relationship: Relationship, e: React.MouseEvent<HTMLDivElement>)=>void,
    geoBtnOnClick?: (relationship: Relationship, e: React.MouseEvent<HTMLDivElement>)=>void
}

export function RelationshipComponent ({relationship, cssAnchor="", containerOnClick, geoBtnOnClick}: RelationShipProps) {
    const person = relationship.to

    const mainImg: string|null = person.media.mainImage;

    return (
        <div className={`person-page__relationship-container ${cssAnchor}`} onClick={
            containerOnClick&&((e)=>containerOnClick(relationship, e))}>
            <div className="relationship-container__main-block">
                <div className="relationship-container_person-img-wrapper">
                    { mainImg ? <img className={"relationship-container__person-img"} src={buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg)} alt="person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
                </div>
                <p className="relationship-container__person-name"><NavLink to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON],person.id)}>{getFullName(person)}</NavLink></p>
            </div>
            <p className="relationship-container__relation-type">{relationship.type}</p>
            <p className="relationship-container__relation-note">{relationship.note}</p>
            <div className="relationship-container__location-btn-wrapper" onClick={
                geoBtnOnClick&&(e=>geoBtnOnClick(relationship, e))
            }>
                <GeoLocationPinDropIcon className={"relationship-container__location-btn"}/>
            </div>
        </div>
    )
}

export default function PersonComponent ({person}: PersonProps) {

    const mainImg: string|undefined = person.media.mainImage?person.media.mainImage:person.media.images[0];

    const [location, setLocation] = useState<GeoLocation|null>(person.location)

    return (
        <div className={"entity-page-wrapper entity-page-wrapper_person"}>
            <section className="entity-page-wrapper__main-entity-section entity-page-wrapper__main-entity-section_person">
                <div className="main-entity-section__main-photo-wrapper main-entity-section__main-photo-wrapper_person">
                    {mainImg ? <img className={"main-entity-section__main-photo"} src={buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg)} alt="person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
                </div>

                <div className="main-entity-section__main-entity-info-container">
                    <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Прізвище:</span> {person.lastName}</p>
                    <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Ім'я:</span> {person.firstName}</p>
                    <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>По-батькові:</span> {person.middleName}</p>
                    <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Стать:</span> {person.sex}</p>
                    <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Дата народження:</span> {person.dateOfBirth?DateEntityTool.getTool(person.dateOfBirth).buildStringDate():valueOrMessage(null)}</p>
                    <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Серія паспорту:</span> {valueOrMessage(person.passportData?.passportSerial)}</p>
                    <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Номер паспорту:</span> {valueOrMessage(person.passportData?.passportNumber)}</p>
                    <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>РНОКПП:</span> {valueOrMessage(person.passportData?.rnokppCode)}</p>
                    <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Адреса:</span> {valueOrMessage(person.location?.address)}</p>
                </div>
            </section>

            <section className="entity-images-slider-section">
                <h4>Фотографії</h4>
                <div className="entity-images-slider-container">
                    <ImageSlider imageLinks={person.media.images.map(imagePath=>buildUrl(appConfig.serverMappings.mediaRootUrl,imagePath))}/>
                </div>
            </section>

            <section className={"person-page__map-section"}>
                <div className="person-page__map-wrapper">
                    <PersonMap person={person} currentLocation={location}/>
                </div>
            </section>

            <section className={"person-page__relationships-section"}>
                <h4 className={'relationships-section__title'}>Пов'язані особи</h4>
                {person.relationshipsInfo.relationships.length > 0 ?
                    <div className={'person-page__relationships-container'}>
                        {person.relationshipsInfo.relationships.map(relationship=><RelationshipComponent key={relationship.to.id} relationship={relationship}/>)}
                    </div>
                    :
                    <p>Пов'язані особи відсутні</p>
                }
            </section>
        </div>
    )
}