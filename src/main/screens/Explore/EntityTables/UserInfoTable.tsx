import {noInfoMessage} from "../../../data/httpErrors";
import GetUserDto from "../../../types/GetUserDto";

type Props = {
    user: GetUserDto
}

const UserInfoTable = ({user}: Props) => {
    return (
        <div className={"entity-container user-container"}>
            <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">ID</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">Email</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">Прізвище</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">Ім'я по-батькові</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">Ім'я</h6></div>
            <div className="entity-container__column-title-block entity-container__column-title-block_user"><h6 className="entity-container__column-title entity-container__column-title_user">Роль</h6></div>

            <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.id?user.id:noInfoMessage}</p></div>
            <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.email?user.email:noInfoMessage}</p></div>
            <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.lastName?user.lastName:noInfoMessage}</p></div>
            <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.middleName?user.middleName:noInfoMessage}</p></div>
            <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.firstName?user.firstName:noInfoMessage}</p></div>
            <div className="entity-container__value entity-container__value_user-block entity-container__value-block_user"><p className="entity-container__value entity-container__value_user">{user.role?user.role:noInfoMessage}</p></div>
        </div>
    )
}

export default UserInfoTable