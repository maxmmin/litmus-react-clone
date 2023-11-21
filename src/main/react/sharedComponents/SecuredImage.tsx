import React, {useContext} from "react";
import {LitmusServiceContext} from "../App";
import {AxiosError} from "axios";
import {HttpStatus} from "../../rest/HttpStatus";
import {useAppSelector} from "../../redux/hooks";

export default function (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    const context = useContext(LitmusServiceContext);

    const authStateManager = context.auth.stateManager;
    const authManager = context.auth.manager;
    const userIdentityManager = context.userIdentity.manager;

    const isPending = useAppSelector(state => state.appState?.isRefreshing);

    async function testAuth (): Promise<boolean> {
        try {
            await userIdentityManager.retrieveIdentity(true);
            return true;
        } catch (e) {
            return !(e instanceof AxiosError && e.response?.status === HttpStatus.UNAUTHENTICATED);
        }
    }

    return <img {...props}
                alt={props.alt}
                onError={async e=>{
                    e.currentTarget.onerror = null;
                    const defaultSrc = e.currentTarget.src;
                    e.currentTarget.src="";

                    if (!isPending&&authStateManager.isAuthenticated()) {
                        console.log("Resolving img load error");

                        testAuth()
                            .then(isAuthOk => {
                                if (!isPending&&!isAuthOk) {
                                    return authManager.refreshAuth();
                                }
                            })
                            .finally(()=>{
                                if (e.currentTarget) {
                                    e.currentTarget.src=defaultSrc;
                                }
                            })
                    }
                }}
    ></img>
}