import {BrowserRouter, Route, Routes} from 'react-router-dom';

import React, {createContext} from 'react';
import HomeScreen from "./home/HomeScreen";
import PrivateComponent from "./authorization/PrivateComponent";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/index.scss';
import Explore from "./exploration/ExplorationScreen";
import LitmusCore from "./LitmusCore";
import Creation from "./creation/CreationScreen";
import {Permissions} from "../redux/types/userIdentity/Role";
import {buildUrl} from "../util/pureFunctions";
import LoginPage from "./login/LoginPage";
import NotificationCenter from "./notifications/NotificationCenter";
import {ErrorBoundary} from "react-error-boundary";
import serviceContext from "./serviceContext";
import appConfig from "../config/appConfig";
import RootScreen from "./RootScreen";
import PersonComponent from "./entity/PersonComponent";
import {Entity} from "../model/Entity";
import PersonScreen from "./entity/PersonScreen";

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
                                <PrivateComponent mode={"ERROR_PAGE"} component={<RootScreen/>} requiredPermissions={[Permissions.DATA_READ]}/>
                            }>
                                <Route path={appConfig.applicationMappings.root} element={<HomeScreen/>}/>
                                <Route path={buildUrl(appConfig.applicationMappings.exploration.root, ':entityDomain')} element={
                                    <Explore/>
                                }/>
                                <Route path={buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON],':id')} element={
                                    <PersonScreen/>
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
