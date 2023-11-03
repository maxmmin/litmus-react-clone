import Header from "./header/Header";
import {Outlet} from "react-router-dom";
import {useAppSelector} from "../redux/hooks";
import {useContext, useMemo} from "react";
import {LitmusServiceContext} from "./App";
import appConfig from "../config/appConfig";
import {matchPath, useLocation} from "react-router";
import {buildUrl} from "../util/pureFunctions";
import {Entity} from "../model/Entity";

export type BackBtnOptions = {
    backPath?: string,
    displayBtn: boolean
}

const backButtonsPathMap: Record<string, BackBtnOptions> = {
    [buildUrl(appConfig.applicationMappings.creation.root, ':entityDomain')]: {
        backPath: appConfig.applicationMappings.root,
        displayBtn: true
    },
    [buildUrl(appConfig.applicationMappings.exploration.root, ':entityDomain')]: {
        backPath: appConfig.applicationMappings.root,
        displayBtn: true
    },
    [buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON], '/:id')]: {
        displayBtn: true
    },
    [buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON], '/:id')]: {
        displayBtn: true
    },
    [buildUrl(appConfig.applicationMappings.entityRoot[Entity.PERSON], '/:id')]: {
        displayBtn: true
    },
}
export default function RootScreen () {
    const isHeaderOpened = useAppSelector(state => state.appState?.isHeaderMenuOpened);
    const appStateManager = useContext(LitmusServiceContext).appState.manager;
    const path = useLocation().pathname;
    const backBtnOptions: BackBtnOptions|null = useMemo<BackBtnOptions|null>(()=>{
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
            <Header backBtnOptions={backBtnOptions||{displayBtn: false}}/>
            <div className="root-screen__content-wrapper">
                <Outlet/>
            </div>
        </div>
    )
}