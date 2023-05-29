import {noInfoMessage} from "../../../util/HttpStatus";
import {useMemo} from "react";
import Person from "../../../types/Person";
import {DateBuilder} from "../../../types/DateEntity";

type Props = {
    person: Person
}

const PersonInfoTable = ({person}: Props) => {
    const passportData = person.passportData;
    return (
    <div className={"entity-container person-container"}>
        <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">ID</h6></div>
        <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Прізвище</h6></div>
        <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Ім'я</h6></div>
        <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Ім'я по-батькові</h6></div>
        <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Дата народження</h6></div>
        <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Номер паспорта</h6></div>
        <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Серія паспорта</h6></div>
        <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">РНОКПП</h6></div>
        <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Адреса</h6></div>

        <div className="entity-container__value entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.id?person.id:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.lastName?person.lastName:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.firstName?person.firstName:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.middleName?person.middleName:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.dateOfBirth?new DateBuilder().buildStringFrom(person.dateOfBirth):noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{passportData?.passportNumber?passportData.passportNumber:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{passportData?.passportSerial?passportData.passportSerial:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{passportData?.rnokppCode?passportData.rnokppCode:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.location?person.location.address:noInfoMessage}</p></div>
    </div>
    )
}

export default  PersonInfoTable

