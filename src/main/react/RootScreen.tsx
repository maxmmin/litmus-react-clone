import Header from "./header/Header";
import {Outlet} from "react-router-dom";
import {useAppSelector} from "../redux/hooks";
import {useContext, useMemo} from "react";
import {LitmusServiceContext} from "./App";
import appConfig from "../config/appConfig";
import {matchPath, useLocation} from "react-router";
import {buildUrl} from "../util/pureFunctions";
import {Entity} from "../model/Entity";

const backButtonsPathMap: Record<string, string|null> = {
    "/": null,
    [buildUrl(appConfig.applicationMappings.creation.root, ':entityDomain')]: appConfig.applicationMappings.home,
    [buildUrl(appConfig.applicationMappings.exploration.root, ':entityDomain')]: appConfig.applicationMappings.home,
    [appConfig.applicationMappings.getEntity[Entity.PERSON]]: appConfig.applicationMappings.home,
    [appConfig.applicationMappings.getEntity[Entity.JUR_PERSON]]: appConfig.applicationMappings.home,
    [appConfig.applicationMappings.getEntity[Entity.USER]]: appConfig.applicationMappings.home,
}

export default function RootScreen () {
    const isHeaderOpened = useAppSelector(state => state.appState?.isHeaderMenuOpened);
    const appStateManager = useContext(LitmusServiceContext).appState.manager;
    const path = useLocation().pathname;
    const currentBackBtnUrl = useMemo<string|null>(()=>{
        const matchedPath = Object.keys(backButtonsPathMap).find(checkedPath=>matchPath(checkedPath, path));
        if (matchedPath) return backButtonsPathMap[matchedPath];
        else return null;
    }, [path])
    return (
        <div className={"root-screen"} onClick={e => {
            if (isHeaderOpened) {
                appStateManager.headerMenuClose();
            }
        }}>
            <Header backButtonPath={currentBackBtnUrl}/>
            <div className="root-screen__content-wrapper">
                <Outlet/>
            </div>
        </div>
    )
}