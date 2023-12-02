import {noInfoMessage} from "../../../error/BasicHttpError";
import {JurPerson, PreProcessedJurPerson} from "../../../model/jurPerson/JurPerson";
import {DateEntityTool} from "../../../model/DateEntity";
import {JurPersonNavLink, PersonNavLink} from "../../../util/navLinkBuilders";
import {GoBubbleIcon} from "../../assets/icons";
import SecuredImage from "../../sharedComponents/SecuredImage";
import {buildImgUrl} from "../../../util/pureFunctions";

type Props = {
    jurPerson: JurPerson
}

const JurPersonInfoTable = ({jurPerson}: Props) => {
    const mainImg = jurPerson.media.mainImage||jurPerson.media.images[0]
    return (
        <div className="entity-container-wrapper entity-container-wrapper_jur-person">
                <div className="entity-container-wrapper__entity-link-wrapper">
                    <JurPersonNavLink jurPerson={jurPerson}>
                        <GoBubbleIcon className={"entity-container-wrapper__entity-link-icon"}/>
                    </JurPersonNavLink>
                </div>

                <div className={"entity-container entity-container_jur-person"}>
                        <div className="entity-container__column-title-block entity-container__column-title-block_jur-person">
                            <h6 className="entity-container__column-title entity-container__column-title_jur-person">ID</h6>
                        </div>
                        <div className="entity-container__column-title-block entity-container__column-title-block_jur-person">
                            <h6 className="entity-container__column-title entity-container__column-title_jur-person">Фото</h6>
                        </div>
                        <div className="entity-container__column-title-block entity-container__column-title-block_jur-person">
                            <h6 className="entity-container__column-title entity-container__column-title_jur-person">Назва</h6>
                        </div>
                        <div className="entity-container__column-title-block entity-container__column-title-block_jur-person">
                            <h6 className="entity-container__column-title entity-container__column-title_jur-person">ЄДРПОУ</h6>
                        </div>
                        <div className="entity-container__column-title-block entity-container__column-title-block_jur-person">
                            <h6 className="entity-container__column-title entity-container__column-title_jur-person">Дата реєстрації</h6>
                        </div>
                        <div className="entity-container__column-title-block entity-container__column-title-block_jur-person">
                            <h6 className="entity-container__column-title entity-container__column-title_jur-person">Власник</h6>
                        </div>
                        <div className="entity-container__column-title-block entity-container__column-title-block_jur-person">
                            <h6 className="entity-container__column-title entity-container__column-title_jur-person">Бенефіціарний власник</h6>
                        </div>
                        <div className="entity-container__column-title-block entity-container__column-title-block_jur-person">
                            <h6 className="entity-container__column-title entity-container__column-title_jur-person">Адреса</h6>
                        </div>

                        <div className="entity-container__value-block entity-container__value-block_jur-person">
                            <p className="entity-container__value entity-container__value_jur-person entity-container__value_id">{jurPerson.id?jurPerson.id:noInfoMessage}</p>
                        </div>
                        <div className="entity-container__value-block entity-container__value-block_img entity-container__value-block_jur-person">
                            {mainImg ?
                                <SecuredImage className={"entity-container__value entity-container__value_jur-person entity-container__value_img"} src={buildImgUrl(mainImg)} alt="person photo"/>
                                :
                                <p className="entity-container__value entity-container__value_jur-person">{noInfoMessage}</p>
                            }
                        </div>
                        <div className="entity-container__value-block entity-container__value-block_jur-person">
                            <p className="entity-container__value entity-container__value_jur-person">{jurPerson.name?jurPerson.name:noInfoMessage}</p>
                        </div>
                        <div className="entity-container__value-block entity-container__value-block_jur-person">
                            <p className="entity-container__value entity-container__value_jur-person">{jurPerson.edrpou?jurPerson.edrpou:noInfoMessage}</p>
                        </div>
                        <div className="entity-container__value-block entity-container__value-block_jur-person">
                            <p className="entity-container__value entity-container__value_jur-person">
                                {jurPerson.dateOfRegistration?DateEntityTool.getStringFrom(jurPerson.dateOfRegistration):noInfoMessage}
                            </p>
                        </div>
                        <div className="entity-container__value-block entity-container__value-block_jur-person">
                            <p className="entity-container__value entity-container__value_jur-person">{jurPerson.owner?jurPerson.owner.lastName:noInfoMessage}</p>
                        </div>
                        <div className="entity-container__value-block entity-container__value-block_jur-person">
                            <p className="entity-container__value entity-container__value_jur-person">{jurPerson.benOwner?jurPerson.benOwner.lastName:noInfoMessage}</p>
                        </div>
                        <div className="entity-container__value-block entity-container__value-block_jur-person">
                            <p className="entity-container__value entity-container__value_jur-person">{jurPerson.location?jurPerson.location.address:noInfoMessage}</p>
                        </div>
                </div>
        </div>
        )
}

export default JurPersonInfoTable