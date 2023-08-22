import {PersonIcon} from "../../util/icons";
import HeaderMenu from "./HeaderMenu";
import React, {useContext} from "react";
import {UserIdentityReducible} from "../../redux/types/userIdentity/UserIdentity";
import {useAppSelector} from "../../redux/hooks";
import BackButton from "../sharedComponents/BackButton";
import {LitmusServiceContext} from "../App";

type PropsType = {
    backButtonPath: string|null
}

const Header = ({backButtonPath}: PropsType) => {
    const userIdentity = useAppSelector<UserIdentityReducible>(state => state.userIdentity);
    const appStateManager = useContext(LitmusServiceContext).appState.manager;
    return (
        <header className="header">
            <h2 style={{
                margin: 0
            }}>LITMUS</h2>
                <div className="header__interact">
                    {backButtonPath?<BackButton path={backButtonPath}/>:null}
                    <div className="header__avatar-container" onClick={e=>{
                        e.stopPropagation();
                        appStateManager.headerMenuToggle();
                    }}>
                        {userIdentity?<span className="header__avatar-letter">{userIdentity!.firstName[0]}</span>:<PersonIcon color={"black"} className="header__avatar-icon" />}

                        <HeaderMenu/>
                    </div>
            </div>
    </header>
    )
}

export default Header;