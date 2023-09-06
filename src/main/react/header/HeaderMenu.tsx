import {Dropdown} from "react-bootstrap";
import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {logOut} from "../../util/pureFunctions";
import AuthenticationManager from "../../service/auth/AuthenticationManager";
import {LitmusServiceContext} from "../App";
import appConfig from "../../config/appConfig";
import ApplicationStateManager from "../../service/appState/ApplicationStateManager";


function HeaderMenu () {
    const isOpened: boolean = useAppSelector<boolean>(state => state.appState!.isHeaderMenuOpened)
    const navigate = useNavigate();

    const serviceContext = useContext(LitmusServiceContext);

    const authManager: AuthenticationManager = serviceContext.auth.manager;
    const appStateManager: ApplicationStateManager = serviceContext.appState.manager;

    async function logout () {
        await authManager.logout();
        appStateManager.headerMenuClose();
        navigate(appConfig.applicationMappings.signIn);
    }

    return (
        <Dropdown bsPrefix='header__home-menu' show={isOpened} onClick={e=>{
            e.stopPropagation();
        }}>
            <Dropdown.Menu variant="light" align='start' >
                <Link className='dropdown-item' to="/profile">Профіль</Link>
                <Link className='dropdown-item' to="/settings">Налаштування</Link>

                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>Вийти</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default HeaderMenu;