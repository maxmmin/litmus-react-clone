import Person, {Relationship} from "../../model/human/person/Person";
import {buildUrl} from "../../util/pureFunctions";
import appConfig from "../../config/appConfig";
import valueOrNull, {valueOrMessage} from "../../util/valueOrNull";
import {DateEntityTool} from "../../model/DateEntity";
import "../../css/entityPage.scss";
import {DashedUserIcon} from "../../util/icons";
import ImageSlider from "./ImageSlider";

type PersonProps = {
    person: Person
}

type RelationShipProps = {
    relationship: Relationship
}

function RelationshipComponent ({relationship}: RelationShipProps) {
    const person = relationship.person

    const mainImg: string|null = person.media.mainImage;

    return (
        <div className="person-page__relationship-container">
            <div className="relationship-container__main">
                <div className="main-entity-section__main-photo-wrapper main-entity-section__main-photo-wrapper_person person-page__relationship-container_person-image-wrapper">
                    { mainImg ? <img className={"main-entity-section__main-photo"} src={buildUrl(appConfig.serverMappings.apiHost,appConfig.serverMappings.mediaRoot, mainImg)} alt="person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
                </div>

                <div className="relationship-container__main-relationship-info">
                    <div className="main-relationship-info__fullname-container">
                        <p className={"main-relationship-info__fullname"}>{person.lastName} {person.firstName} {valueOrNull(person.middleName)}</p>
                    </div>

                    <div className="main-relationship-info__relation-type-container">
                        <p className={"main-relationship-info__relation-type"}>{relationship.type}</p>
                    </div>
                </div>
            </div>

            <div className="relation-ship-container__note-container">
                <p className={"relation-ship-container__note"}>{relationship.note?relationship.note:"Додаткова інформація відсутня"}</p>
            </div>
        </div>
    )
}

export default function PersonComponent ({person}: PersonProps) {

    const mainImg: string|undefined = person.media.mainImage?person.media.mainImage:person.media.images[0];

    return (
        <div className={"entity-page-wrapper entity-page-wrapper_person"}>
            <section className="entity-page-wrapper__main-entity-section entity-page-wrapper__main-entity-section_person">
                <div className="main-entity-section__main-photo-wrapper main-entity-section__main-photo-wrapper_person">
                    {mainImg ? <img className={"main-entity-section__main-photo"} src={buildUrl(appConfig.serverMappings.apiHost,appConfig.serverMappings.mediaRoot, mainImg)} alt="person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
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
                    <ImageSlider imageLinks={person.media.images.map(imagePath=>buildUrl(appConfig.serverMappings.apiHost,appConfig.serverMappings.mediaRoot,imagePath))}/>
                </div>
            </section>

            <section className={"person-page__relationships-section"}>
                <h4 className={'relationships-section__title'}>Пов'язані особи</h4>
                {person.relationships.length > 0 ?
                    <div className={'person-page__relationships-container'}>
                        {person.relationships.map(relationship=><RelationshipComponent key={relationship.person.id} relationship={relationship}/>)}
                    </div>
                    :
                    <p>Пов'язані особи відсутні</p>
                }
            </section>
        </div>
    )
}