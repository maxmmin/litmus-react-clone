import {JurPerson} from "../../../model/jurPerson/JurPerson";
import {buildUrl} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";
import {DashedUserIcon} from "../../../util/icons";
import {valueOrMessage} from "../../../util/valueOrNull";
import {DateEntityTool} from "../../../model/DateEntity";
import React from "react";
import {buildPersonLink} from "../../exploration/EntityTables/PersonInfoTable";

export default function JurPersonComponent({jurPerson}: {jurPerson: JurPerson}) {
    const mainImg: string|undefined = jurPerson.media.mainImage||jurPerson.media.images[0];

    const ownerLink = jurPerson.owner&&buildPersonLink(jurPerson.owner.id);
    const benOwnerLink = jurPerson.benOwner&&buildPersonLink(jurPerson.benOwner.id);

    const formattedDateOfRegistration = jurPerson.dateOfRegistration&&DateEntityTool.getTool(jurPerson.dateOfRegistration).buildStringDate();

    return (
        <section className="entity-page-wrapper__main-entity-section entity-page-wrapper__main-entity-section_jur-person">
            <div className={`main-entity-section__main-photo-wrapper main-entity-section__main-photo-wrapper_jur-person ${mainImg?"":"no-photo"}`}>
                {mainImg ? <img className={"main-entity-section__main-photo"} src={buildUrl(appConfig.serverMappings.mediaRootUrl, mainImg)} alt="person photo"/> : <DashedUserIcon className={"main-entity-section__main-photo main-entity-section__main-photo_placeholder"}/>}
            </div>

            <div className="main-entity-section__main-entity-info-container">
                <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>Назва:</span> {jurPerson.name}</p>
                <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>ЄДРПОУ:</span> {valueOrMessage(jurPerson.edrpou)}</p>
                <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>По-батькові:</span> {valueOrMessage(ownerLink)}</p>
                <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>Стать:</span> {valueOrMessage(benOwnerLink)}</p>
                <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>Дата реєстрації:</span> {valueOrMessage(formattedDateOfRegistration)}</p>
                <p className={"main-entity-info-container__item main-entityPageComponents-info-container__item_jur-person"}><span className={"main-entity-info-container__item-key main-entityPageComponents-info-container__item-key_jur-person"}>Адреса реєстрації:</span> {valueOrMessage(jurPerson.location?.address)}</p>
            </div>
        </section>
    )
}