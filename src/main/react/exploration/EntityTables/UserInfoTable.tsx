import {noInfoMessage} from "../../../error/BasicHttpError";
import User from "../../../model/human/user/User";
import {UserNavLink} from "../../../util/navLinkBuilders";
import {GoBubbleIcon} from "../../assets/icons";

type Props = {
    user: User
}

const UserInfoTable = ({user}: Props) => {
    return (
        <div className="entity-container-wrapper user-container-wrapper">
            <div className="entity-container-wrapper__entity-link-wrapper">
                <UserNavLink user={user}>
                    <GoBubbleIcon className={"entity-container-wrapper__entity-link-icon"}/>
                </UserNavLink>
            </div>
            <div className={"entity-container user-container"}>
                <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">ID</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">Email</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">Прізвище</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">Ім'я по-батькові</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">Ім'я</h6></div>
                <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">Роль</h6></div>

                <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.id}</p></div>
                <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.email}</p></div>
                <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.lastName}</p></div>
                <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.middleName?user.middleName:noInfoMessage}</p></div>
                <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.firstName}</p></div>
                <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.role.canonicalName}</p></div>
            </div>
        </div>
    )
}

export default UserInfoTable