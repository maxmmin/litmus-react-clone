import {BrowserRouter, Route, Routes} from 'react-router-dom';

import React from 'react';
import SignIn from "./react/screens/signIn/signIn";
import Home from "./react/screens/home/home";
import PrivateComponent, {ERROR_PAGE} from "./react/screens/authorization/PrivateComponent";
import {useAppDispatch} from "./redux/hooks";
import store from "./redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.scss';
import {roles} from "./redux/userIdentity/Role";
import Explore from "./react/screens/exploration/exploration";
import {AppStateActions,switchAppState} from "./redux/applicationState/AppStateActions";
import ApplicationStateCenter from "./react/screens/serviceComponents/ApplicationStateCenter";
import Creation from "./react/screens/creation/creation";
import {routingLinks} from "./util/appConfig";
import {Entity} from "./redux/exploration/EntityExplorationState";

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
                                <PrivateComponent mode={"ERROR_PAGE"} component={<Home/>} requiredPermissions={roles.USER.permissions}/>
                            }/>

                            <Route path={routingLinks.explore[Entity.PERSON]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Explore/>} requiredPermissions={roles.USER.permissions}/>
                            }/>

                            <Route path={routingLinks.explore[Entity.JUR_PERSON]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Explore/>} requiredPermissions={roles.USER.permissions}/>
                            }/>

                            <Route path={routingLinks.explore[Entity.USER]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Explore/>} requiredPermissions={roles.ADMIN.permissions}/>
                            }/>

                            <Route path={routingLinks.create[Entity.PERSON]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={roles.MODERATOR.permissions}/>
                            }/>

                            <Route path={routingLinks.create[Entity.JUR_PERSON]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={roles.MODERATOR.permissions}/>
                            }/>

                            <Route path={routingLinks.create[Entity.USER]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={roles.ADMIN.permissions}/>
                            }/>

                            <Route path="/sign-in" element={<SignIn/>}/>
                        </Routes>
                    </div>
                </ApplicationStateCenter>
            </BrowserRouter>
      )
}

export default App;
