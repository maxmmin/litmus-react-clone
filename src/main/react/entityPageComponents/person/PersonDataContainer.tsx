import {buildUrl} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";
import {DashedUserIcon} from "../../assets/icons";
import {valueOrMessage} from "../../../util/functional/valueOrNull";
import {DateEntityTool} from "../../../model/DateEntity";
import React from "react";
import Person from "../../../model/human/person/Person";
import SecuredImage from "../../sharedComponents/SecuredImage";

export default function PersonDataContainer ({person, cssAnchor=""}: {person: Omit<Person, 'relationships'>, cssAnchor?: string}) {

    const mainImg: string|undefined = person.media.mainImage||person.media.images[0];

    return (
        <div className={`entity-data-container entity-data-container_person ${cssAnchor}`}>
            <div className={`main-entity-section__main-photo-wrapper main-entity-section__main-photo-wrapper_person ${mainImg?"":"no-photo"}`}>
                {mainImg ? <SecuredImage className={"main-entity-section__main-photo"} src={buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg)} alt="person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
            </div>

            <div className="main-entity-section__main-entity-info-container">
                <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>ID:</span> {person.id}</p>
                <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Прізвище:</span> {person.lastName}</p>
                <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Ім'я:</span> {person.firstName}</p>
                <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>По-батькові:</span> {valueOrMessage(person.middleName)}</p>
                <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Стать:</span> {person.sex}</p>
                <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Дата народження:</span> {person.dateOfBirth?DateEntityTool.getTool(person.dateOfBirth).buildStringDate():valueOrMessage(null)}</p>
                <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Серія паспорту:</span> {valueOrMessage(person.passportData?.passportSerial)}</p>
                <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Номер паспорту:</span> {valueOrMessage(person.passportData?.passportNumber)}</p>
                <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>РНОКПП:</span> {valueOrMessage(person.passportData?.rnokppCode)}</p>
                <p className={"main-entity-info-container__item main-entity-info-container__item_person"}><span className={"main-entity-info-container__item-key main-entity-info-container__item-key_person"}>Адреса:</span> {valueOrMessage(person.location?.address)}</p>
            </div>


        </div>
    )
}