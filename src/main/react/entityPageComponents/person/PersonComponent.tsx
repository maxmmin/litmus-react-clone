import Person, {PreProcessedPerson, Relationship} from "../../../model/human/person/Person";
import {buildImgUrl, buildUrl, hasLocation} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";
import {valueOrMessage} from "../../../util/functional/valueOrNull";
import {DateEntityTool} from "../../../model/DateEntity";
import "../../assets/styles/entityPage/entityPage.scss";
import "../../assets/styles/entityPage/personPage.scss";
import {DashedUserIcon, GeoLocationPinDropIcon} from "../../assets/icons";
import ImageSlider from "../ImageSlider";
import PersonMap, {PersonMapProps} from "./PersonMap";
import React, {useContext, useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import {Entity} from "../../../model/Entity";
import {LitmusServiceContext} from "../../App";
import Loader from "../../loader/Loader";
import getFullName from "../../../util/functional/getFullName";
import {ServiceContext} from "../../serviceContext";
import RelationshipComponent from "../RelationshipComponent";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import RelatedJurPersonComponent from "../RelatedJurPersonComponent";
import BasicRipePersonUtil from "../../../util/person/BasicRipePersonUtil";

type PersonProps = {
    rawPerson: PreProcessedPerson
}


export default function PersonComponent ({rawPerson}: PersonProps) {
    const [isPending, setPending] = useState<boolean>(true);
    
    const [person, setPerson] = useState<Person|null>(null);

    const serviceContext: ServiceContext = useContext(LitmusServiceContext);

    const bindService = serviceContext.personServices.personProcessor;

    const [displayedEntity, setDisplayedEntity] = useState<PersonMapProps['currentlyDisplayed']|null>(null)

    useEffect(()=>{
        setPending(true);
        bindService
            .bindShared(rawPerson, -1)
            .then(person=>{
                console.log(person);
                setPerson(person);
                if (hasLocation(person)) {
                    setDisplayedEntity({to: person});
                }
            })
            .finally(()=>setPending(false));
    }, [rawPerson])

    const rootJurPersons: JurPerson[] = (person?.ownedJurPersons||[]).concat(person?.benOwnedJurPersons||[]);

    const mainImg: string|undefined = rawPerson.media.mainImage||rawPerson.media.images[0];

    if (isPending) return <Loader/>

    if (!person) throw new Error("no person was loaded");

    return (
        <div className={"entity-page-wrapper entity-page-wrapper_person"}>
            <section className="entity-page-wrapper__main-entity-section entity-page-wrapper__main-entity-section_person">
                <div className={`main-entity-section__main-photo-wrapper main-entity-section__main-photo-wrapper_person ${mainImg?"":"no-photo"}`}>
                    {mainImg ? <img className={"main-entity-section__main-photo"} src={buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg)} alt="person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
                </div>

                <div className="main-entity-section__main-entity-info-container">
                    <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_person"}>Прізвище:</span> {rawPerson.lastName}</p>
                    <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_person"}>Ім'я:</span> {rawPerson.firstName}</p>
                    <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_person"}>По-батькові:</span> {valueOrMessage(rawPerson.middleName)}</p>
                    <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_person"}>Стать:</span> {rawPerson.sex}</p>
                    <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_person"}>Дата народження:</span> {rawPerson.dateOfBirth?DateEntityTool.getTool(rawPerson.dateOfBirth).buildStringDate():valueOrMessage(null)}</p>
                    <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_person"}>Серія паспорту:</span> {valueOrMessage(rawPerson.passportData?.passportSerial)}</p>
                    <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_person"}>Номер паспорту:</span> {valueOrMessage(rawPerson.passportData?.passportNumber)}</p>
                    <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_person"}>РНОКПП:</span> {valueOrMessage(rawPerson.passportData?.rnokppCode)}</p>
                    <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_person"}>Адреса:</span> {valueOrMessage(rawPerson.location?.address)}</p>
                </div>
            </section>

            <section className="entity-images-slider-section">
                <h4>Фотографії</h4>
                {
                    person.media.images.length>0
                    ?
                        <div className="entity-images-slider-container">
                            <ImageSlider imageLinks={rawPerson.media.images.map(buildImgUrl)}/>
                        </div>
                    :
                        <p>Фотографії особи відсутні</p>
                }
            </section>

            {displayedEntity && hasLocation(person) &&
                <section className={"person-page__map-section"}>
                    <div className="person-page__map-wrapper">
                        <PersonMap person={person} currentlyDisplayed={displayedEntity}/>
                    </div>
                </section>
            }

            <section className={"person-page__relationships-section"}>
                <h4 className={'person-section__title'}>Пов'язані фізичні особи</h4>
                {
                    person.relationships.length > 0 ?
                    <div className={'person-page__relationships-container'}>
                        <div className="related-entity-table-header related-entity-table-header_person">
                            <h6 className='related-entity-container__header-title related-entity-container__header-title_main'>Основна інформація</h6>
                            <h6 className='related-entity-container__header-title'>Тип відношення</h6>
                        </div>
                        {person.relationships.map(relationship=>{

                            let cssAnchor: string;
                            if (person.location) {
                                cssAnchor = relationship.to.location?"":"disabled-geo"
                            } else {
                                cssAnchor = "no-geo";
                            }

                            return (<RelationshipComponent key={relationship.to.id}
                                                   relationship={relationship}
                                                   cssAnchor={cssAnchor}
                                                   geoBtnOnClick={(r,_e)=>{
                                                       const toPerson = r.to;
                                                       if (hasLocation(toPerson)) {
                                                           setDisplayedEntity({to: toPerson});
                                                       }
                                                   }}
                            />)
                        })}
                    </div>
                    :
                    <p>Пов'язані особи відсутні</p>
                }
            </section>

            <section className="person-page__related-jur-persons-section">
                <h4 className={'related-jur-person-section__title'}>Пов'язані юридичні особи</h4>
                {
                    rootJurPersons.length > 0 ?
                        <div className={'person-page__related-jur-persons-container'}>
                            <div className="related-entity-table-header related-entity-table-header_jur-person">
                                <h6 className='related-entity-container__header-title related-entity-container__header-title_main'>Основна інформація</h6>
                                <h6 className='related-entity-container__header-title'>Власник</h6>
                                <h6 className='related-entity-container__header-title'>Бен. власник</h6>
                            </div>
                            {rootJurPersons.map(jurPerson=>{

                                let cssAnchor: string;
                                if (person.location) {
                                    cssAnchor = jurPerson.location?"":"disabled-geo"
                                } else {
                                    cssAnchor = "no-geo";
                                }

                                return (<RelatedJurPersonComponent key={jurPerson.id}
                                                                   jurPerson={jurPerson}
                                                                   cssAnchor={cssAnchor}
                                                                   geoBtnOnClick={(j,_e)=>{
                                                                       if (hasLocation(j)) {
                                                                           setDisplayedEntity({to: j});
                                                                       }
                                                                   }}
                                />)
                            })}
                        </div>
                        :
                        <p>Пов'язані особи відсутні</p>
                }
            </section>
        </div>
    )
}