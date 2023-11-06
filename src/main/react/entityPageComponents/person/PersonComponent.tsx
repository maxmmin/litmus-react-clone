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
import PersonDataContainer from "./PersonDataContainer";

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

    if (isPending) return <Loader/>

    if (!person) throw new Error("no person was loaded");

    return (
        <div className={"entity-page-wrapper entity-page-wrapper_person"}>
            <section className="entity-page-wrapper__main-entity-section entity-page-wrapper__main-entity-section_person">
                <PersonDataContainer person={person}/>
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
                    <div className={`person-page__relationships-container`}>
                        <div className={`related-entity-table-header related-entity-table-header_person ${person.location ? "" : "no-geo"}`}>
                            <h6 className='related-entity-container__header-title related-entity-container__header-title_main'>Основна інформація</h6>
                            <h6 className='related-entity-container__header-title'>Тип відношення</h6>
                            <h6 className='related-entity-container__header-title'>Примітка</h6>
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
                        <div className={`person-page__related-jur-persons-container`}>
                            <div className={`related-entity-table-header related-entity-table-header_jur-person ${person.location?"":"no-geo"}`}>
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