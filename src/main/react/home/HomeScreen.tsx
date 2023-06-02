import React, {useState} from "react";
import {AddUserIcon, SearchIcon, SetUpUser} from "../../util/icons";
import PrivateComponentWrapper from "../authorization/PrivateComponentWrapper";
import {roles} from "../../redux/userIdentity/Role";
import {NO_OUTPUT} from "../authorization/PrivateComponent";
import {useNavigate} from 'react-router-dom'
import Header from "../header/Header";
import {routingLinks} from "../../config/appConfig";
import {Entity} from "../../redux/exploration/EntityExplorationState";
import {useAppSelector} from "../../redux/hooks";


function HomeScreen () {

    const explorationTable = useAppSelector(state => state.explorationParams?.entity)

    const creationTable = useAppSelector(state => state.creationParams?.table)

    const [isOpened, setIsOpened] = useState(false);

    const navigate = useNavigate()

    const actionOnClick = (event: React.MouseEvent) => {
        const actionPath = event.currentTarget.getAttribute("itemprop")
        if (actionPath) {
            navigate(actionPath)
        }
    }

    return (
        <div className="homepage" onClick={(e)=>{
            if (isOpened) {
                setIsOpened(false)
            }
        }}>
            <Header/>

            <main className="homepage-actions">
                    <div itemProp={`${explorationTable?routingLinks.explore[explorationTable]:Entity.PERSON}`} className="homepage-actions__action" onClick={actionOnClick}>
                        <div className="homepage-actions__icon-container">
                            <SearchIcon className='homepage-actions__icon'/>
                            <h4 className="homepage-actions__title homepage-actions__title_search">Аналіз</h4>
                        </div>
                    </div>
                    <PrivateComponentWrapper mode={NO_OUTPUT} requiredPermissions={roles.MODERATOR.permissions}>
                        <div itemProp={`${creationTable?routingLinks.create[creationTable]:Entity.PERSON}`} className="homepage-actions__action" onClick={actionOnClick}>
                            <div className="homepage-actions__icon-container">
                                <AddUserIcon className='homepage-actions__icon'/>
                                <h4 className="homepage-actions__title">Додати</h4>
                            </div>
                        </div>
                    </PrivateComponentWrapper>
                    <PrivateComponentWrapper mode={NO_OUTPUT} requiredPermissions={roles.ADMIN.permissions}>
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