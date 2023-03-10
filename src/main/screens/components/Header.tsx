import {PersonIcon} from "../../data/icons";
import HeaderMenu from "./HeaderMenu";
import React from "react";
import {UserIdentityType} from "../../types/UserIdentity";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {appStateAction, AppStateActions} from "../../redux/actions/AppStateActions";
import BackButton from "./BackButton";

type PropsType = {
    backButton?: boolean;
}

const Header = ({backButton = false}: PropsType) => {
    const dispatch = useAppDispatch();
    const userIdentity = useAppSelector<UserIdentityType>(state => state.userIdentity);
    return (
        <header className="header">
            <h2 style={{
                margin: 0
            }}>LITMUS</h2>
                <div className="header__interact">
                    {backButton?<BackButton/>:null}
                    <div className="header__avatar-container" onClick={e=>{
                        e.stopPropagation();
                        dispatch(appStateAction(AppStateActions.HEADER_MENU_TOGGLE))
                    }}>
                        {userIdentity?<span className="header__avatar-letter">{userIdentity!.firstName[0]}</span>:<PersonIcon className="header__avatar-icon" />}

                        <HeaderMenu/>
                    </div>
            </div>
    </header>
    )
}

export default Header;