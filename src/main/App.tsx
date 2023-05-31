import {BrowserRouter, Route, Routes} from 'react-router-dom';

import React from 'react';
import SignIn from "./react/screens/SignIn/SignIn";
import Home from "./react/screens/Home/Home";
import PrivateComponent, {ERROR_PAGE} from "./react/components/PrivateComponent";
import {useAppDispatch} from "./redux/hooks";
import store from "./redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.scss';
import {roles} from "./redux/userIdentity/Role";
import Explore from "./react/screens/Explore/Explore";
import {AppStateActions,switchAppState} from "./redux/applicationState/AppStateActions";
import ApplicationStateManager from "./react/components/ApplicationStateManager";
import Creation from "./react/screens/Create/Create";
import {routingLinks} from "./util/appConfig";
import {Entity} from "./redux/exploration/explorationParams";

// @todo check if the refresh token expired

function App() {
    const dispatch = useAppDispatch();
  return (
            <BrowserRouter basename={"/"}>
                <ApplicationStateManager>
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

                            <Route path={routingLinks.explore[Entity.PERSONS]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Explore/>} requiredPermissions={roles.USER.permissions}/>
                            }/>

                            <Route path={routingLinks.explore[Entity.JUR_PERSONS]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Explore/>} requiredPermissions={roles.USER.permissions}/>
                            }/>

                            <Route path={routingLinks.explore[Entity.USERS]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Explore/>} requiredPermissions={roles.ADMIN.permissions}/>
                            }/>

                            <Route path={routingLinks.create[Entity.PERSONS]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={roles.MODERATOR.permissions}/>
                            }/>

                            <Route path={routingLinks.create[Entity.JUR_PERSONS]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={roles.MODERATOR.permissions}/>
                            }/>

                            <Route path={routingLinks.create[Entity.USERS]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={roles.ADMIN.permissions}/>
                            }/>

                            <Route path="/sign-in" element={<SignIn/>}/>
                        </Routes>
                    </div>
                </ApplicationStateManager>
            </BrowserRouter>
      )
}

export default App;
