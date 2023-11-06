import {noInfoMessage} from "../../../error/BasicHttpError";
import Person, {NoRelationsPerson} from "../../../model/human/person/Person";
import {DateEntityTool} from "../../../model/DateEntity";
import {NavLink} from "react-router-dom";
import {buildImgUrl, buildUrl} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";
import {Entity} from "../../../model/Entity";

type Props = {
    person: NoRelationsPerson
}

export function buildPersonLink(id: number, text?: string) {
    return <NavLink to={buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON], id.toString())}>{text||id}</NavLink>
}

const PersonInfoTable = ({person}: Props) => {
    const passportData = person.passportData;

    const mainImg = person.media.mainImage||person.media.images[0];

    return (
    <div className="entity-container-wrapper person-container-wrapper">
        <div className={"entity-container person-container"}>
            <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">ID</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Фото</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Прізвище</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Ім'я</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Ім'я по-батькові</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Дата народження</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Номер паспорта</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Серія паспорта</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">РНОКПП</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_person"><h6 className="entity-container__column-title entity-container__column-title_person">Адреса</h6></div>

            <div className="entity-container__value-block entity-container__value-block_person">
                <p className="entity-container__value entity-container__value_person">
                    {buildPersonLink(person.id)}
                </p>
            </div>
            <div className="entity-container__value-block entity-container__value-block_person">
                {mainImg ?
                    <img className={"entity-container__value entity-container__value_person entity-container__value_person-img"} src={buildImgUrl(mainImg)} alt="person photo"/>
                    :
                    <p className="entity-container__value entity-container__value_person">{noInfoMessage}</p>
                }
            </div>
            <div className="entity-container__value-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.lastName}</p></div>
            <div className="entity-container__value-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.firstName}</p></div>
            <div className="entity-container__value-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.middleName?person.middleName:noInfoMessage}</p></div>
            <div className="entity-container__value-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.dateOfBirth?DateEntityTool.getStringFrom(person.dateOfBirth):noInfoMessage}</p></div>
            <div className="entity-container__value-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{passportData?.passportNumber?passportData.passportNumber:noInfoMessage}</p></div>
            <div className="entity-container__value-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{passportData?.passportSerial?passportData.passportSerial:noInfoMessage}</p></div>
            <div className="entity-container__value-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{passportData?.rnokppCode?passportData.rnokppCode:noInfoMessage}</p></div>
            <div className="entity-container__value-block entity-container__value-block_person"><p className="entity-container__value entity-container__value_person">{person.location?person.location.address:noInfoMessage}</p></div>
        </div>
    </div>
    )
}

export default  PersonInfoTable

