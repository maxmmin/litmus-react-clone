import {PersonIcon} from "../assets/icons";
import HeaderMenu from "./HeaderMenu";
import React, {useContext} from "react";
import {UserIdentityStateReducible} from "../../model/userIdentity/UserIdentity";
import {useAppSelector} from "../../redux/hooks";
import BackButton from "../sharedComponents/BackButton";
import {LitmusServiceContext} from "../App";
import {BackBtnOptions} from "../RootScreen";
import {NavLink} from "react-router-dom";
import appConfig from "../../config/appConfig";

type PropsType = {
    backBtnOptions: BackBtnOptions,
}

const Header = ({backBtnOptions: {backPath, displayBtn}}: PropsType) => {
    const userIdentity = useAppSelector<UserIdentityStateReducible>(state => state.userIdentity);
    const appStateManager = useContext(LitmusServiceContext).appGlobalState.manager;

    return (
        <header className="header">
            <h2 style={{
                margin: 0
            }}>
                <NavLink className={"header-logo-nav"} to={appConfig.applicationMappings.root}>LITMUS</NavLink>
            </h2>
                <div className="header__interact">
                    {displayBtn&&<BackButton path={backPath}/>}
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