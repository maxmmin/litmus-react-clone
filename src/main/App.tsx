import {BrowserRouter, Route, Routes} from 'react-router-dom';

import React from 'react';
import SignIn from "./react/signIn/SignInScreen";
import Home from "./react/home/HomeScreen";
import PrivateComponent, {ERROR_PAGE} from "./react/authorization/PrivateComponent";
import {useAppDispatch} from "./redux/hooks";
import store from "./redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.scss';
import Explore from "./react/exploration/ExplorationScreen";
import {AppStateActions,switchAppState} from "./redux/applicationState/AppStateActions";
import ApplicationStateCenter from "./react/applicationState/ApplicationStateCenter";
import Creation from "./react/creation/CreationScreen";
import appConfig, {routingLinks} from "./config/appConfig";
import {Entity} from "./redux/exploration/EntityExplorationState";
import Role from "./redux/userIdentity/Role";

// @todo check if the refresh token expired

function App() {
    const dispatch = useAppDispatch();
  return (
            <BrowserRouter basename={"/"}>
                <ApplicationStateCenter>
                    <div className={"wrapper"} onClick={e=>{
                        const appStore = store.getState();
                        const isMenuOpened = appStore.appState?.isHeaderMenuOpened;

                        if (isMenuOpened) {
                            dispatch(switchAppState(AppStateActions.HEADER_MENU_CLOSE))
                        }
                    }}>
                        <Routes>
                            <Route path={"/"} element={
                                <PrivateComponent mode={"ERROR_PAGE"} component={<Home/>} requiredPermissions={Role.USER.permissions}/>
                            }/>

                            <Route path={""} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Explore/>} requiredPermissions={Role.USER.permissions}/>
                            }/>

                            <Route path={`${appConfig.applicationMappings.explorationRoot}:entityDomain`} element={
                                <Explore/>
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

                            <Route path="/sign-in" element={<SignIn/>}/>
                        </Routes>
                    </div>
                </ApplicationStateCenter>
            </BrowserRouter>
      )
}

export default App;
