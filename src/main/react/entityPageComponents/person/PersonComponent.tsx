import Person, {PreProcessedPerson} from "../../../model/human/person/Person";
import {buildImgUrl, hasLocation} from "../../../util/pureFunctions";
import "../../assets/styles/entityPage/entityPage.scss";
import "../../assets/styles/entityPage/personPage.scss";
import ImageSlider from "../ImageSlider";
import PersonMap, {PersonMapProps} from "./PersonMap";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {LitmusServiceContext} from "../../App";
import Loader from "../../loader/Loader";
import {ServiceContext} from "../../serviceContext";
import RootRelatedPersonComponent from "../RootRelatedPersonComponent";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import PersonDataContainer from "./PersonDataContainer";
import PersonMapTool from "../../../util/map/person/PersonMapTool";
import {RelationsLabelsMetaData} from "../../../util/map/MapPainter";
import {mapRelatedJurPerson, mapRelatedPerson} from "../mapFunctions";
import {TrashIcon} from "../../assets/icons";

type PersonProps = {
    rawPerson: PreProcessedPerson
}


export default function PersonComponent ({rawPerson}: PersonProps) {
    const [isPending, setPending] = useState<boolean>(true);
    
    const [person, setPerson] = useState<Person|null>(null);

    const serviceContext: ServiceContext = useContext(LitmusServiceContext);

    const bindService = serviceContext.personServices.personProcessor;

    const personUtil = serviceContext.personServices.ripePersonUtil;

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

    const deepRelated = useMemo<Person[]>(()=>{
        if (person) {
            return [...personUtil.extractRelatedPersons(person)].filter(p=>person.relationships.findIndex(r=>r.to===p)===-1);
        } else return [];
    }, [person])

    const mapTool: PersonMapTool = serviceContext.map.personMapTool;
    const mapMetadata = useMemo<RelationsLabelsMetaData|null>(()=>{
        if (person&&hasLocation(person)) {
            return mapTool.buildEntityMetadata(person);
        } else return null;
    }, [person])

    if (isPending) return <Loader/>

    if (!person) throw new Error("no person was loaded");

    const possibleRelatedJurPersons: Set<JurPerson> = new Set(
        (person?.relationships
            .flatMap(r=>r.to.ownedJurPersons.concat(r.to.benOwnedJurPersons))||[])
            .filter(jp=>!person.ownedJurPersons.concat(person.benOwnedJurPersons).includes(jp))
    );

    return (
        <div className={"entity-page-wrapper entity-page-wrapper_person"}>
            <section className="entity-page-wrapper__main-entity-section entity-page-wrapper__main-entity-section_person">
                <PersonDataContainer person={person}/>

                <div className="main-entity-section__manage-entity-container">
                    <button className="btn manage-entity-container__action-btn manage-entity-container__action-btn_remove">
                        <TrashIcon color={"black"} className={"manage-entity-container__action-icon manage-entity-container__action-icon_remove"}/>
                    </button>
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

            {mapMetadata && displayedEntity &&
                <section className={"person-page__map-section"}>
                    <div className="person-page__map-wrapper">
                        <PersonMap metadata={mapMetadata} currentlyDisplayed={displayedEntity}/>
                    </div>
                </section>
            }

            <section className={"person-page__relationships-section"}>
                <h4 className={'person-section__title'}>Пов'язані фізичні особи</h4>
                {
                    person.relationships.length > 0 ?
                    <div className={`person-page__relationships-container`}>
                        <div className={`related-entity-table-header related-entity-table-header_root-related-person ${person.location ? "" : "no-geo"}`}>
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

                            return (<RootRelatedPersonComponent key={relationship.to.id}
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

            <section className="entity-page__related-jur-persons-section">
                <h4 className={'related-jur-person-section__title'}>Пов'язані юридичні особи</h4>
                {
                    rootJurPersons.length > 0 ?
                        <div className={`person-page__related-jur-persons-container`}>
                            <div className={`related-entity-table-header related-entity-table-header_jur-person ${person.location?"":"no-geo"}`}>
                                <h6 className='related-entity-container__header-title related-entity-container__header-title_main'>Основна інформація</h6>
                                <h6 className='related-entity-container__header-title'>Власник</h6>
                                <h6 className='related-entity-container__header-title'>Бен. власник</h6>
                            </div>
                            {rootJurPersons.map(j=>mapRelatedJurPerson(j,mapMetadata,setDisplayedEntity))}
                        </div>
                        :
                        <p>Пов'язані особи відсутні</p>
                }
            </section>

            {
                deepRelated.length > 0 &&
                    <section className={"entity-page__possible-related-persons-section"}>
                        <h4 className={'person-section__title'}>Можливо пов'язані фізичні особи</h4>

                        <div className={`person-page__possible-related-persons-container`}>
                            <div className={`related-entity-table-header related-entity-table-header_possible-related-person ${person.location ? "" : "no-geo"}`}>
                                <h6 className='related-entity-container__header-title related-entity-container__header-title_main'>Основна інформація</h6>
                                <h6 className='related-entity-container__header-title'>Пов'язані фізичні особи</h6>
                                <h6 className='related-entity-container__header-title'>Пов'язані юридичні особи</h6>
                            </div>
                            {deepRelated.map(possibleRelated=>mapRelatedPerson(possibleRelated,mapMetadata,setDisplayedEntity))}
                        </div>

                    </section>
            }

            {
                possibleRelatedJurPersons.size>0 &&
                <section className="entity-page__related-jur-persons-section">
                    <h4 className={'related-jur-person-section__title'}>Можливо пов'язані юридичні особи</h4>
                    {
                            <div className={`person-page__related-jur-persons-container`}>
                                <div className={`related-entity-table-header related-entity-table-header_jur-person ${person.location?"":"no-geo"}`}>
                                    <h6 className='related-entity-container__header-title related-entity-container__header-title_main'>Основна інформація</h6>
                                    <h6 className='related-entity-container__header-title'>Власник</h6>
                                    <h6 className='related-entity-container__header-title'>Бен. власник</h6>
                                </div>
                                {[...possibleRelatedJurPersons].map(j=>mapRelatedJurPerson(j, mapMetadata,setDisplayedEntity))}
                            </div>
                    }
                </section>
            }

        </div>
    )
}