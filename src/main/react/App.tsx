import {BrowserRouter, Route, Routes} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/index.scss';

import React, {createContext} from 'react';
import HomeScreen from "./home/HomeScreen";
import PrivateComponent from "./authorization/PrivateComponent";
import ExplorationScreen from "./exploration/ExplorationScreen";
import LitmusCore from "./LitmusCore";
import Creation from "./creation/CreationScreen";
import {Permission} from "../model/userIdentity/Role";
import {buildUrl} from "../util/pureFunctions";
import LoginPage from "./login/LoginPage";
import NotificationCenter from "./notifications/NotificationCenter";
import {ErrorBoundary} from "react-error-boundary";
import serviceContext from "../serviceContext";
import appConfig from "../config/appConfig";
import RootScreen from "./RootScreen";
import {Entity} from "../model/Entity";
import UserPage from "./entityPageComponents/user/UserPage";
import PersonUrlPageWrapper from "./entityPageComponents/person/PersonPageUrlWrapper";
import JurPersonUrlPageWrapper from "./entityPageComponents/jur-person/JurPersonUrlPageWrapper";
import UserUrlPageWrapper from "./entityPageComponents/user/UserUrlPageWrapper";

export const LitmusServiceContext = createContext(serviceContext);

function App() {
    return (
        <ErrorBoundary fallback={<h1>Something went wrong...</h1>}>
            <NotificationCenter/>
            <BrowserRouter basename={"/"}>
                <LitmusCore>
                    <div className={"wrapper"}>
                        <Routes>
                            <Route path={"/"} element={
                                <PrivateComponent mode={"NO_OUTPUT"} component={<RootScreen/>} requiredPermissions={[Permission.DATA_READ]}/>
                            }>
                                <Route path={appConfig.applicationMappings.root} element={<HomeScreen/>}/>

                                <Route path={buildUrl(appConfig.applicationMappings.exploration.root, ':entityDomain')} element={
                                    <ExplorationScreen/>
                                }/>

                                <Route path={buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON],':id')} element={
                                    <PersonUrlPageWrapper/>
                                }/>

                                <Route path={buildUrl(appConfig.applicationMappings.entityRoot[Entity.JUR_PERSON],':id')} element={
                                    <JurPersonUrlPageWrapper/>
                                }/>

                                <Route path={buildUrl(appConfig.applicationMappings.entityRoot[Entity.USER],':id')} element={
                                    <UserUrlPageWrapper/>
                                }/>

                                <Route path={buildUrl(appConfig.applicationMappings.creation.root, ':entityDomain')} element={
                                    <Creation/>
                                }/>

                            </Route>

                            <Route path={appConfig.applicationMappings.signIn} element={<LoginPage/>}/>
                        </Routes>
                    </div>
                </LitmusCore>
            </BrowserRouter>
        </ErrorBoundary>
    )
}

export default App;
