import React, {useContext, useEffect, useState} from "react";
import {LitmusServiceContext} from "../App";
import {AxiosError} from "axios";
import {HttpStatus} from "../../rest/HttpStatus";
import {useAppSelector} from "../../redux/hooks";
import {set} from "ol/transform";

export default function (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    const context = useContext(LitmusServiceContext);

    const userIdentityManager = context.userIdentity.manager;
    const appStateManager = context.appState.manager;

    async function testAuth (): Promise<void> {
        try {
            await userIdentityManager.retrieveIdentity(false);
        } catch (e) {}
    }

    const [handled, setHandled] = useState<boolean>(false);

    return <img {...props}
                alt={props.alt}
                onError={async e=>{
                    if (!handled&&!appStateManager.isSecuredImgHandling()) {
                        appStateManager.enableSecuredImgHandling();
                        e.currentTarget.onerror = null;
                        e.currentTarget.src="";

                        try {
                            await testAuth();
                        } finally {
                            appStateManager.disableSecuredImgHandling();
                            setHandled(true);
                        }
                    }
                }}
    ></img>
}