import {JurPerson, PreProcessedJurPerson} from "../../../model/jurPerson/JurPerson";
import {buildImgUrl, buildUrl, hasLocation} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";
import {DashedUserIcon, GeoLocationPinDropIcon, GoBubbleIcon} from "../../assets/icons";
import {valueOrMessage} from "../../../util/functional/valueOrNull";
import {DateEntityTool} from "../../../model/DateEntity";
import React, {useContext, useEffect, useState} from "react";
import ImageSlider from "../ImageSlider";
import JurPersonMap, {JurPersonMapProps} from "./JurPersonMap";
import {ServiceContext} from "../../serviceContext";
import {LitmusServiceContext} from "../../App";
import JurPersonProcessor from "../../../service/jurPersonProcessing/JurPersonProcessor";
import Loader from "../../loader/Loader";
import "../../assets/styles/entityPage/jurPersonPage.scss";
import getFullName from "../../../util/functional/getFullName";
import {noInfoMessage} from "../../../error/BasicHttpError";
import PersonDataContainer from "../person/PersonDataContainer";
import {buildPersonNavLink} from "../../../util/navLinkBuilders";
import Person from "../../../model/human/person/Person";

function getRelatedGeoIconCssAnchor(jurPerson: JurPerson, person: Person, defaultAnchor: string = ""): string {
    if (jurPerson.location) {
        if (person.location) {
            return defaultAnchor;
        } else return "disabled-geo"
    } else return "no-geo"
}

export default function JurPersonComponent({rawJurPerson}: {rawJurPerson: PreProcessedJurPerson}) {
    const [isPending, setPending] = useState<boolean>(true);

    const [jurPerson, setJurPerson] = useState<JurPerson|null>(null)

    const [displayedEntity, setDisplayedEntity] = useState<JurPersonMapProps['currentlyDisplayed']|null>(null)


    const serviceContext: ServiceContext = useContext(LitmusServiceContext);

    const bindService: JurPersonProcessor = serviceContext.jurPersonServices.jurPersonProcessor;

    useEffect(()=>{
        setPending(true);
        bindService
            .bindShared(rawJurPerson, -1)
            .then(jurPerson=>{
                console.log(jurPerson);
                setJurPerson(jurPerson);
                if (hasLocation(jurPerson)) {
                    setDisplayedEntity({to: jurPerson});
                }
            })
            .finally(()=>setPending(false));
    }, [rawJurPerson])

    if (isPending) return <Loader/>

    if (!jurPerson) throw new Error("no person was loaded");

    const mainImg: string|undefined = jurPerson.media.mainImage||jurPerson.media.images[0];

    const ownerLink = jurPerson.owner&&buildPersonNavLink(jurPerson.owner.id, getFullName(jurPerson.owner));
    const benOwnerLink = jurPerson.benOwner&&buildPersonNavLink(jurPerson.benOwner.id, getFullName(jurPerson.benOwner));

    const formattedDateOfRegistration = jurPerson.dateOfRegistration&&DateEntityTool.getTool(jurPerson.dateOfRegistration).buildStringDate();

    return (
        <div className={"entity-page-wrapper entity-page-wrapper_jur-person"}>
            <section className="entity-page-wrapper__main-entity-section entity-page-wrapper__main-entity-section_jur-person">
                <div className="entity-data-container entity-data-container_jur-person">
                    <div className={`main-entity-section__main-photo-wrapper main-entity-section__main-photo-wrapper_jur-person ${mainImg?"":"no-photo"}`}>
                        {mainImg ? <img className={"main-entity-section__main-photo"} src={buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg)} alt="person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
                    </div>

                    <div className="main-entity-section__main-entity-info-container">
                        <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>Назва:</span> {jurPerson.name}</p>
                        <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>ЄДРПОУ:</span> {valueOrMessage(jurPerson.edrpou)}</p>
                        <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>Власник:</span> {valueOrMessage(ownerLink)}</p>
                        <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>Бенефіціарний власник:</span> {valueOrMessage(benOwnerLink)}</p>
                        <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>Дата реєстрації:</span> {valueOrMessage(formattedDateOfRegistration)}</p>
                        <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>Адреса реєстрації:</span> {valueOrMessage(jurPerson.location?.address)}</p>
                    </div>
                </div>
            </section>

            <section className="entity-images-slider-section">
                <h4>Фотографії</h4>
                {
                    jurPerson.media.images.length>0
                        ?
                        <div className="entity-images-slider-container">
                            <ImageSlider imageLinks={jurPerson.media.images.map(buildImgUrl)}/>
                        </div>
                        :
                        <p>Фотографії відсутні</p>
                }
            </section>

            {displayedEntity && hasLocation(jurPerson) &&
                <section className={"jur-person-page__map-section"}>
                    <div className="jur-person-page__map-wrapper">
                        <JurPersonMap jurPerson={jurPerson} currentlyDisplayed={displayedEntity}/>
                    </div>
                </section>
            }

            <section className="jur-person-page__owners-section">
                <div className="owners-section__owner-item owners-section__owner-item_owner">
                    <div className={"owner-item__heading"}>
                        <h4 className={"owner-item__title"}>Власник</h4>
                        {jurPerson.owner&&
                            <div className={`owner-item__interact-container ${getRelatedGeoIconCssAnchor(jurPerson, jurPerson.owner)}`}>
                                <div className="owner-item__location-btn-wrapper" onClick={()=>{
                                    if (jurPerson.owner&&hasLocation(jurPerson.owner)) {
                                        setDisplayedEntity({to: jurPerson.owner})
                                    }
                                }}>
                                    <GeoLocationPinDropIcon
                                        className={`owner-item__location-btn`}
                                    />
                                </div>

                                {buildPersonNavLink(jurPerson.owner.id,<GoBubbleIcon className={"owner-item__link-icon"}/>)}
                            </div>
                        }
                    </div>
                    {jurPerson.owner ?
                        <PersonDataContainer cssAnchor={"jur-person-page-embed"} person={jurPerson.owner}/>
                        :
                        noInfoMessage
                    }
                </div>

                <div className="owners-section__owner-item owners-section__owner-item_owner">
                    <div className={"owner-item__heading"}>
                        <h4 className={"owner-item__title"}>Бенефіціарний власник</h4>
                            {jurPerson.benOwner&&
                                <div className={`owner-item__interact-container ${getRelatedGeoIconCssAnchor(jurPerson, jurPerson.benOwner)}`}>
                                    <div className="owner-item__location-btn-wrapper"
                                         onClick={()=>{
                                             if (jurPerson.benOwner&&hasLocation(jurPerson.benOwner)) {
                                                 setDisplayedEntity({to: jurPerson.benOwner})
                                             }
                                         }}
                                    >
                                        <GeoLocationPinDropIcon
                                            className={`owner-item__location-btn`}
                                        />
                                    </div>

                                    {buildPersonNavLink(jurPerson.benOwner.id,<GoBubbleIcon className={"owner-item__link-icon"}/>)}
                                </div>
                            }
                    </div>
                    {jurPerson.benOwner ?
                        <PersonDataContainer cssAnchor={"jur-person-page-embed"} person={jurPerson.benOwner}/>
                        :
                        noInfoMessage
                    }
                </div>
            </section>
        </div>
    )
}