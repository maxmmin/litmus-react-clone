import React, {useContext, useEffect, useRef, useState} from "react";
import {LitmusServiceContext} from "../App";
import {useAppSelector} from "../../redux/hooks";

export default function (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    const context = useContext(LitmusServiceContext);

    const userIdentityManager = context.userIdentity.manager;
    const appStateManager = context.appGlobalState.manager;

    async function testAuth (): Promise<void> {
        try {
            await userIdentityManager.retrieveIdentity(false);
        } catch (e) {}
    }

    const [handled, setHandled] = useState<boolean>(false);

    const [error, setError] = useState<boolean>(false);

    const isParallelHandling = useAppSelector(state => state.appState!.securedImgHandling)

    const [path, setPath] = useState(props.src)

    useEffect(()=>{
        if (!handled&&!isParallelHandling&&error) {
            if (path) {
                setHandled(true);

                const param = "timestamp="+Date.now();
                if (path.includes("?")) {
                    setPath(prev=>prev!.concat("&").concat(param));
                } else setPath(prev=>prev!.concat("?").concat(param));
            }
        }
    }, [handled,isParallelHandling])

    return <img {...props}
                alt={props.alt}
                src={path}
                onLoad={()=>setError(false)}
                onError={handled ?
                    undefined
                        :
                    (async e=>{
                        setError(true);

                        e.currentTarget.onerror = null;

                        if (!isParallelHandling) {
                            appStateManager.enableSecuredImgHandling();
                            setHandled(true);
                            try {
                                await testAuth();
                            } finally {
                                appStateManager.disableSecuredImgHandling();
                            }
                        }
                    })
                }
    ></img>
}