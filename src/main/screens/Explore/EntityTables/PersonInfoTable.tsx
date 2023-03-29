import GetPersonDto from "../../../types/person/GetPersonDto";
import {noInfoMessage} from "../../../data/httpErrors";

type Props = {
    person: GetPersonDto
}

const PersonInfoTable = ({person}: Props) => {
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

        <div className="entity-container__value entity-container__value_person-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.id?person.id:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value_person-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.lastName?person.lastName:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value_person-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.firstName?person.firstName:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value_person-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.middleName?person.middleName:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value_person-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.dateOfBirth?person.dateOfBirth.join("/"):noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value_person-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.passportNumber?person.passportNumber:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value_person-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.passportSerial?person.passportSerial:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value_person-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.rnokppCode?person.rnokppCode:noInfoMessage}</p></div>
        <div className="entity-container__value entity-container__value_person-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.place?person.place:noInfoMessage}</p></div>
    </div>
    )
}

export default  PersonInfoTable

