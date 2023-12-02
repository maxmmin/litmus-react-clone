import React from "react";
import {AddUserIcon, SearchIcon, SetUpUser} from "../assets/icons";
import PrivateComponentWrapper from "../authorization/PrivateComponentWrapper";
import {NO_OUTPUT} from "../authorization/PrivateComponent";
import {useNavigate} from 'react-router-dom'
import appConfig from "../../config/appConfig";
import {useAppSelector} from "../../redux/hooks";
import {LocalRole, Permission, RoleName} from "../../model/userIdentity/Role";


function HomeScreen () {

    const navigate = useNavigate()

    const exploredEntity = useAppSelector(state => state.exploration.exploredEntity)

    const emergingEntity = useAppSelector(state => state.creation.selectedEntity)

    const actionOnClick = (event: React.MouseEvent) => {
        const actionPath = event.currentTarget.getAttribute("itemprop")
        if (actionPath) {
            navigate(actionPath)
        }
    }

    return (
        <div className="homepage">
            <main className="homepage-actions">
                    <div itemProp={appConfig.applicationMappings.exploration[exploredEntity!]} className="homepage-actions__action" onClick={actionOnClick}>
                        <div className="homepage-actions__icon-container">
                            <SearchIcon className='homepage-actions__icon'/>
                            <h4 className="homepage-actions__title homepage-actions__title_search">Аналіз</h4>
                        </div>
                    </div>
                    <PrivateComponentWrapper mode={NO_OUTPUT} requiredPermissions={[Permission.DATA_CREATE]}>
                        <div itemProp={appConfig.applicationMappings.creation[emergingEntity!]} className="homepage-actions__action" onClick={actionOnClick}>
                            <div className="homepage-actions__icon-container">
                                <AddUserIcon className='homepage-actions__icon'/>
                                <h4 className="homepage-actions__title">Додати</h4>
                            </div>
                        </div>
                    </PrivateComponentWrapper>
                    <PrivateComponentWrapper mode={NO_OUTPUT} requiredPermissions={LocalRole[RoleName.ADMIN].permissions}>
                        <div itemProp={"/admin"} className="homepage-actions__action" onClick={actionOnClick}>
                            <div className="homepage-actions__icon-container">
                                <SetUpUser className='homepage-actions__icon'/>
                                <h4 className="homepage-actions__title">ADMIN</h4>
                            </div>
                        </div>
                    </PrivateComponentWrapper>
            </main>
        </div>
    )
}

export default HomeScreen;