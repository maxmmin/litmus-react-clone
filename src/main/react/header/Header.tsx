import {PersonIcon} from "../../util/icons";
import HeaderMenu from "./HeaderMenu";
import React from "react";
import {UserIdentityReducible} from "../../redux/types/userIdentity/UserIdentity";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import AppStateAction, {switchAppState} from "../../redux/actions/AppStateAction";
import BackButton from "../sharedComponents/BackButton";

type PropsType = {
    backButtonPath?: string
}

const Header = ({backButtonPath}: PropsType) => {
    const dispatch = useAppDispatch();
    const userIdentity = useAppSelector<UserIdentityReducible>(state => state.userIdentity);
    return (
        <header className="header">
            <h2 style={{
                margin: 0
            }}>LITMUS</h2>
                <div className="header__interact">
                    {backButtonPath?<BackButton path={backButtonPath}/>:null}
                    <div className="header__avatar-container" onClick={e=>{
                        e.stopPropagation();
                        dispatch(switchAppState(AppStateAction.HEADER_MENU_TOGGLE))
                    }}>
                        {userIdentity?<span className="header__avatar-letter">{userIdentity!.firstName[0]}</span>:<PersonIcon className="header__avatar-icon" />}

                        <HeaderMenu/>
                    </div>
            </div>
    </header>
    )
}

export default Header;