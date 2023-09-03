import axios, {AxiosError, AxiosRequestConfig} from "axios/index";
import appConfig from "./appConfig";
import {HttpStatus} from "../rest/HttpStatus";
import AuthenticationStateManager from "../service/auth/stateManager/AuthenticationStateManager";
import ServiceContext from "../react/serviceContext";
import {HttpErrorParser} from "../error/BasicHttpError";
import ErrorResponse from "../rest/ErrorResponse";

interface RetryConfig extends AxiosRequestConfig {
    retry: number;
    retryDelay: number;
}

export const globalConfig: RetryConfig = {
    retry: 1,
    retryDelay: 0,
};

const instance = axios.create({
    baseURL: appConfig.serverMappings.apiHost,
    xsrfCookieName: appConfig.xsrfCookieName,
    xsrfHeaderName: appConfig.xsrfHeaderName
})

const authStateManager: AuthenticationStateManager = ServiceContext.auth.stateManager;

instance.interceptors.response.use(
    (response) => response,
    async (err: AxiosError<ErrorResponse<unknown>>) => {
        const {config} = err;

        if (config && err.status === HttpStatus.UNAUTHENTICATED) {
            try {
                await instance.post(appConfig.serverMappings.refreshTokens);
                return await instance(config);
            } catch {
                await instance.post(appConfig.serverMappings.logout).catch();
                authStateManager.logout();
            }
        }

        return HttpErrorParser.parseAxiosError(err);
    }
);

export default instance;