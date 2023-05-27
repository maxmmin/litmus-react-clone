import {BrowserRouter, Route, Routes} from 'react-router-dom';

import React from 'react';
import SignIn from "./screens/SignIn/SignIn";
import Home from "./screens/Home/Home";
import PrivateComponent, {ForbiddenOutputCallbackModesEnum} from "./screens/components/PrivateComponent";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import store from "./redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.scss';
import {roles} from "./types/Role";
import Explore from "./screens/Explore/Explore";
import {AppStateActions,switchAppState} from "./redux/actions/AppStateActions";
import ApplicationStateManager from "./screens/components/ApplicationStateManager";
import Notification from "./screens/components/Notification";
import Creation from "./screens/Create/Create";
import {routingLinks} from "./data/appConfig";
import {Tables} from "./types/explorationParams";

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
                          <Notification/>
                          <Routes>
                              <Route path={"/"} element={
                                  <PrivateComponent mode={ForbiddenOutputCallbackModesEnum.ERROR_PAGE} Component={<Home/>} neededPermissions={roles.USER.permissions}/>
                              }/>

                              <Route path={routingLinks.explore[Tables.PERSONS]} element={
                                  <PrivateComponent mode={ForbiddenOutputCallbackModesEnum.ERROR_PAGE} Component={<Explore/>} neededPermissions={roles.USER.permissions}/>
                              }/>

                              <Route path={routingLinks.explore[Tables.JUR_PERSONS]} element={
                                  <PrivateComponent mode={ForbiddenOutputCallbackModesEnum.ERROR_PAGE} Component={<Explore/>} neededPermissions={roles.USER.permissions}/>
                              }/>

                              <Route path={routingLinks.explore[Tables.USERS]} element={
                                  <PrivateComponent mode={ForbiddenOutputCallbackModesEnum.ERROR_PAGE} Component={<Explore/>} neededPermissions={roles.ADMIN.permissions}/>
                              }/>

                              <Route path={routingLinks.create[Tables.PERSONS]} element={
                                  <PrivateComponent mode={ForbiddenOutputCallbackModesEnum.ERROR_PAGE} Component={<Creation/>} neededPermissions={roles.MODERATOR.permissions}/>
                              }/>

                              <Route path={routingLinks.create[Tables.JUR_PERSONS]} element={
                                  <PrivateComponent mode={ForbiddenOutputCallbackModesEnum.ERROR_PAGE} Component={<Creation/>} neededPermissions={roles.MODERATOR.permissions}/>
                              }/>

                              <Route path={routingLinks.create[Tables.USERS]} element={
                                  <PrivateComponent mode={ForbiddenOutputCallbackModesEnum.ERROR_PAGE} Component={<Creation/>} neededPermissions={roles.ADMIN.permissions}/>
                              }/>

                              <Route path="/sign-in" element={<SignIn/>}/>
                          </Routes>
                      </div>
                  </ApplicationStateManager>
              </BrowserRouter>

      )
}

export default App;
