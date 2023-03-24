import React, {useState} from "react";
import {AddUserIcon, SearchIcon, SetUpUser} from "../../data/icons";
import PrivateComponentWrapper from "../components/PrivateComponentWrapper";
import {roles} from "../../types/Role";
import {ForbiddenOutputCallbackModesEnum} from "../components/PrivateComponent";
import {useNavigate} from 'react-router-dom'
import Header from "../components/Header";
import {routingLinks} from "../../data/appConfig";
import {Tables} from "../../types/explorationParams";
import {useAppSelector} from "../../redux/hooks";


function Home () {

    const explorationTable = useAppSelector(state => state.explorationParams?.table)

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
                    <div itemProp={`${explorationTable?routingLinks.explore[explorationTable]:Tables.PERSONS}`} className="homepage-actions__action" onClick={actionOnClick}>
                        <div className="homepage-actions__icon-container">
                            <SearchIcon className='homepage-actions__icon'/>
                            <h4 className="homepage-actions__title homepage-actions__title_search">Аналіз</h4>
                        </div>
                    </div>
                    <PrivateComponentWrapper mode={ForbiddenOutputCallbackModesEnum.NO_OUTPUT} neededPermissions={roles.MODERATOR.permissions}>
                        <div itemProp={`${creationTable?routingLinks.create[creationTable]:Tables.PERSONS}`} className="homepage-actions__action" onClick={actionOnClick}>
                            <div className="homepage-actions__icon-container">
                                <AddUserIcon className='homepage-actions__icon'/>
                                <h4 className="homepage-actions__title">Додати</h4>
                            </div>
                        </div>
                    </PrivateComponentWrapper>
                    <PrivateComponentWrapper mode={ForbiddenOutputCallbackModesEnum.NO_OUTPUT} neededPermissions={roles.ADMIN.permissions}>
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

export default Home;