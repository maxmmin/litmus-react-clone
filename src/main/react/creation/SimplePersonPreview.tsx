import {SimplePersonResponseDto} from "../../rest/dto/person/PersonResponseDto";
import {buildPersonNavLink} from "../../util/navLinkBuilders";
import {GoBubbleIcon} from "../assets/icons";
import {buildImgUrl} from "../../util/pureFunctions";
import {noInfoMessage} from "../../error/BasicHttpError";
import Person from "../../model/human/person/Person";
import {DateEntityTool} from "../../model/DateEntity";
import {valueOrMessage} from "../../util/functional/valueOrNull";
import SecuredImage from "../sharedComponents/SecuredImage";

type Props = {
    person: Pick<Person, keyof SimplePersonResponseDto>
}
export default function ({person}: Props) {
    const mainImg = person.media.mainImage||person.media.images[0];
    return (
        <div className="entity-container-wrapper entity-container-wrapper_simple-person">
            <div className="entity-container-wrapper__entity-link-wrapper">
                {buildPersonNavLink(person.id,<GoBubbleIcon className={"entity-container-wrapper__entity-link-icon"}/>)}
            </div>
            <div className={"entity-container entity-container_simple-person"}>
                <div className="entity-container__column-title-block entity-container__column-title-block_simple-person"><h6 className="entity-container__column-title entity-container__column-title_simple-person">ID</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_simple-person"><h6 className="entity-container__column-title entity-container__column-title_simple-person">Фото</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_simple-person"><h6 className="entity-container__column-title entity-container__column-title_simple-person">Прізвище</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_simple-person"><h6 className="entity-container__column-title entity-container__column-title_simple-person">Ім'я</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_simple-person"><h6 className="entity-container__column-title entity-container__column-title_simple-person">Ім'я по-батькові</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_simple-person"><h6 className="entity-container__column-title entity-container__column-title_simple-person">Стать</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_simple-person"><h6 className="entity-container__column-title entity-container__column-title_simple-person">Дата народження</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_simple-person"><h6 className="entity-container__column-title entity-container__column-title_simple-person">Адреса</h6></div>


                <div className="entity-container__value-block entity-container__value-block_simple-person">
                    <p className="entity-container__value entity-container__value_simple-person">{person.id}</p>
                </div>
                <div className="entity-container__value-block entity-container__value-block_img entity-container__value-block_simple-person">
                    {mainImg ?
                        <SecuredImage className={"entity-container__value entity-container__value_simple-person entity-container__value_img"} src={buildImgUrl(mainImg)} alt="person photo"/>
                        :
                        <p className="entity-container__value entity-container__value_simple-person">{noInfoMessage}</p>
                    }
                </div>
                <div className="entity-container__value-block entity-container__value-block_simple-person"><p className="entity-container__value entity-container__value_simple-person">{person.lastName}</p></div>
                <div className="entity-container__value-block entity-container__value-block_simple-person"><p className="entity-container__value entity-container__value_simple-person">{person.firstName}</p></div>
                <div className="entity-container__value-block entity-container__value-block_simple-person"><p className="entity-container__value entity-container__value_simple-person">{valueOrMessage(person.middleName)}</p></div>
                <div className="entity-container__value-block entity-container__value-block_simple-person"><p className="entity-container__value entity-container__value_simple-person">{person.sex}</p></div>
                <div className="entity-container__value-block entity-container__value-block_simple-person"><p className="entity-container__value entity-container__value_simple-person">{person.dateOfBirth?DateEntityTool.getStringFrom(person.dateOfBirth):noInfoMessage}</p></div>
                <div className="entity-container__value-block entity-container__value-block_simple-person"><p className="entity-container__value entity-container__value_simple-person">{valueOrMessage(person.location?.address)}</p></div>
            </div>
        </div>
    )
}