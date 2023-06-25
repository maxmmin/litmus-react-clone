import {BrowserRouter, Route, Routes} from 'react-router-dom';

import React, {createContext} from 'react';
import Home from "./home/HomeScreen";
import PrivateComponent, {ERROR_PAGE} from "./authorization/PrivateComponent";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import store from "../redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/index.scss';
import Explore from "./exploration/ExplorationScreen";
import AppStateAction, {switchAppState} from "../redux/actions/AppStateAction";
import LitmusCore from "./LitmusCore";
import Creation from "./creation/CreationScreen";
import appConfig, {routingLinks} from "../config/appConfig";
import Role, {Permissions} from "../redux/types/userIdentity/Role";
import {buildUrl} from "../util/pureFunctions";
import {Entity} from "../model/Entity";
import LoginPage from "./login/LoginPage";
import NotificationCenter from "./notifications/NotificationCenter";
import {ErrorBoundary} from "react-error-boundary";
import serviceContext from "./serviceContext";

export const LitmusServiceContext = createContext(serviceContext);

function App() {
    const dispatch = useAppDispatch();

    const reactServiceContext = React.createContext(serviceContext);

    return (
        <ErrorBoundary fallback={<h1>Something went wrong...</h1>}>
            <NotificationCenter/>
            <BrowserRouter basename={"/"}>
                <LitmusCore>
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

                            <Route path={routingLinks.creation[Entity.PERSON]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={Role.MODERATOR.permissions}/>
                            }/>

                            <Route path={routingLinks.creation[Entity.JUR_PERSON]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={Role.MODERATOR.permissions}/>
                            }/>

                            <Route path={routingLinks.creation[Entity.USER]} element={
                                <PrivateComponent mode={ERROR_PAGE} component={<Creation/>} requiredPermissions={Role.ADMIN.permissions}/>
                            }/>

                            <Route path="/sign-in" element={<LoginPage/>}/>
                        </Routes>
                    </div>
                </LitmusCore>
            </BrowserRouter>
        </ErrorBoundary>
    )
}

export default App;