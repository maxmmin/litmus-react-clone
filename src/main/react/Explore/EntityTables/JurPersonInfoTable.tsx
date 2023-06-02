import {noInfoMessage} from "../../../util/HttpStatus";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import {DateBuilder} from "../../../model/DateEntity";

type Props = {
    jurPerson: JurPerson
}

const JurPersonInfoTable = ({jurPerson}: Props) => {
    return (
        <div className={"entity-container jur-person-container"}>
            <div className="entity-container__column-title entity-container__column-title-block_jur-person"><h6 className="entity-container__column-title entity-container__column-title_jur-person">ID</h6></div>
            <div className="entity-container__column-title entity-container__column-title-block_jur-person"><h6 className="entity-container__column-title entity-container__column-title_jur-person">Назва</h6></div>
            <div className="entity-container__column-title entity-container__column-title-block_jur-person"><h6 className="entity-container__column-title entity-container__column-title_jur-person">ЄДРПОУ</h6></div>
            <div className="entity-container__column-title entity-container__column-title-block_jur-person"><h6 className="entity-container__column-title entity-container__column-title_jur-person">Дата реєстрації</h6></div>
            <div className="entity-container__column-title entity-container__column-title-block_jur-person"><h6 className="entity-container__column-title entity-container__column-title_jur-person">Власник</h6></div>
            <div className="entity-container__column-title entity-container__column-title-block_jur-person"><h6 className="entity-container__column-title entity-container__column-title_jur-person">Бенефіціарний власник</h6></div>
            <div className="entity-container__column-title entity-container__column-title-block_jur-person"><h6 className="entity-container__column-title entity-container__column-title_jur-person">Адреса</h6></div>

            <div className="entity-container__value-block entity-container__value-block_jur-person"><p className="entity-container__value entity-container__value_jur-person">{jurPerson.id?jurPerson.id:noInfoMessage}</p></div>
            <div className="entity-container__value-block entity-container__value-block_jur-person"><p className="entity-container__value entity-container__value_jur-person">{jurPerson.name?jurPerson.name:noInfoMessage}</p></div>
            <div className="entity-container__value-block entity-container__value-block_jur-person"><p className="entity-container__value entity-container__value_jur-person">{jurPerson.edrpou?jurPerson.edrpou:noInfoMessage}</p></div>
            <div className="entity-container__value-block entity-container__value-block_jur-person"><p className="entity-container__value entity-container__value_jur-person">{jurPerson.dateOfRegistration?new DateBuilder().buildStringFrom(jurPerson.dateOfRegistration):noInfoMessage}</p></div>
            <div className="entity-container__value-block entity-container__value-block_jur-person"><p className="entity-container__value entity-container__value_jur-person">{jurPerson.owner?jurPerson.owner.lastName:noInfoMessage}</p></div>
            <div className="entity-container__value-block entity-container__value-block_jur-person"><p className="entity-container__value entity-container__value_jur-person">{jurPerson.benOwner?jurPerson.benOwner.lastName:noInfoMessage}</p></div>
            <div className="entity-container__value entity-container__value-block_jur-person"><p className="entity-container__value entity-container__value_jur-person">{jurPerson.location?jurPerson.location.address:noInfoMessage}</p></div>
        </div>
)
}

export default JurPersonInfoTable