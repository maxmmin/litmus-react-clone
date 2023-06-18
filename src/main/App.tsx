import {BrowserRouter, Route, Routes} from 'react-router-dom';

import React from 'react';
import Home from "./react/home/HomeScreen";
import PrivateComponent, {ERROR_PAGE} from "./react/authorization/PrivateComponent";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import store from "./redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.scss';
import Explore from "./react/exploration/ExplorationScreen";
import AppStateAction, {switchAppState} from "./redux/actions/AppStateAction";
import AuthComponent from "./react/auth/AuthComponent";
import Creation from "./react/creation/CreationScreen";
import appConfig, {routingLinks} from "./config/appConfig";
import Role, {Permissions} from "./redux/types/userIdentity/Role";
import {buildUrl} from "./util/pureFunctions";
import {Entity} from "./model/Entity";
import LoginPage from "./react/login/LoginPage";
import NotificationCenter from "./react/notifications/NotificationCenter";
import {ErrorBoundary} from "react-error-boundary";

// @todo check if the refresh token expired

function App() {
    const dispatch = useAppDispatch();

  return (
      <ErrorBoundary fallback={<h1>Something went wrong...</h1>}>
            <NotificationCenter/>
            <BrowserRouter basename={"/"}>
                <AuthComponent>
                    <div className={"wrapper"} onClick={e=>{
                        const appStore = store.getState();
                        const isMenuOpened = appStore.appState?.isHeaderMenuOpened;

                        if (isMenuOpened) {
                            dispatch(switchAppState(AppStateAction.HEADER_MENU_CLOSE))
                        }
                        // @todo think about replace this
                        }}>
                        <Routes>
                            <Route path={"/"} element={
                                <PrivateComponent mode={"ERROR_PAGE"} component={<Home/>} requiredPermissions={[Permissions.DATA_READ]}/>
                            }/>

                            <Route path={""} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Explore/>} requiredPermissions={[Permissions.DATA_READ]}/>
                            }/>

                            <Route path={buildUrl(appConfig.applicationMappings.exploration.root, ':entityDomain')} element={
                                <Explore/>
                            }/>

                            <Route path={buildUrl(appConfig.applicationMappings.creation.root, ':entityDomain')} element={
                                <Creation/>
                            }/>

                            <Route path={routingLinks.create[Entity.PERSON]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={Role.MODERATOR.permissions}/>
                            }/>

                            <Route path={routingLinks.create[Entity.JUR_PERSON]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={Role.MODERATOR.permissions}/>
                            }/>

                            <Route path={routingLinks.create[Entity.USER]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={Role.ADMIN.permissions}/>
                            }/>

                            <Route path="/sign-in" element={<LoginPage/>}/>
                        </Routes>
                    </div>
                </AuthComponent>
            </BrowserRouter>
      </ErrorBoundary>
      )
}

export default App;
