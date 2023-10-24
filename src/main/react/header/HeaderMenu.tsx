import {Dropdown} from "react-bootstrap";
import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAppSelector} from "../../redux/hooks";
import AuthenticationManager from "../../service/auth/AuthenticationManager";
import {LitmusServiceContext} from "../App";
import appConfig from "../../config/appConfig";
import ApplicationStateManager from "../../service/appState/ApplicationStateManager";
import {HttpErrorParser} from "../../error/BasicHttpError";


function HeaderMenu () {
    const isOpened: boolean = useAppSelector<boolean>(state => state.appState!.isHeaderMenuOpened)
    const navigate = useNavigate();

    const serviceContext = useContext(LitmusServiceContext);

    const authManager: AuthenticationManager = serviceContext.auth.manager;
    const appStateManager: ApplicationStateManager = serviceContext.appState.manager;

    const notificationManager = serviceContext.notification.manager;

    async function logout () {
        try {
            appStateManager.enablePending()
            await authManager.logout();
            appStateManager.headerMenuClose();
            navigate(appConfig.applicationMappings.signIn);
        } catch (e) {
            const err = HttpErrorParser.parseError(e);

            notificationManager.error(HttpErrorParser.getErrorDescription(err))

            console.error(e);
        } finally {
            appStateManager.disablePending();
        }

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