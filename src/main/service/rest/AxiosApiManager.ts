import axios, {AxiosError, AxiosInstance} from "axios";
import appConfig from "../../config/appConfig";
import {HttpStatus} from "../../rest/HttpStatus";
import AuthenticationStateManager from "../auth/stateManager/AuthenticationStateManager";
import ErrorResponse from "../../rest/ErrorResponse";
import AuthenticationStateManagerImpl from "../auth/stateManager/AuthenticationStateManagerImpl";

class AxiosApiManager {
    private static csrfHeader: string = "X-XSRF-TOKEN";

    private static readonly authStateManager: AuthenticationStateManager = new AuthenticationStateManagerImpl();

    private static csrfToken: string|undefined;

    private static readonly _globalApiInstance: AxiosInstance = this.createApiInstance();

    public static setCsrfToken (csrfToken: string) {
        this.csrfToken = csrfToken;
        this._globalApiInstance.defaults.headers[this.csrfHeader] = csrfToken;
    }

    public static setCsrfHeader (csrfHeader: string) {
        this.csrfHeader = csrfHeader;
        if (this.csrfToken) this._globalApiInstance.defaults.headers[this.csrfHeader] = this.csrfToken;
    }

    static get globalApiInstance(): AxiosInstance {
        return this._globalApiInstance;
    }

    private static createApiInstance (): AxiosInstance {
        const globalInstance = this.createRawApiInstance();

        const noHandlerApiInstance = this.createRawApiInstance();
        if (this.csrfToken) noHandlerApiInstance.defaults.headers[this.csrfHeader] = this.csrfToken;

        if (this.csrfToken!==undefined) globalInstance.defaults.headers[this.csrfHeader] = this.csrfToken;

        const manager = this.authStateManager;

        globalInstance.interceptors.response.use(
            (response) => response,
            async (err: AxiosError<ErrorResponse<unknown>>) => {
                const {config} = err;

                if (manager.isAuthenticated() && config && err.response?.status === HttpStatus.UNAUTHENTICATED) {
                    try {
                        await noHandlerApiInstance.post(appConfig.serverMappings.refreshTokens);
                        return await globalInstance(config);
                    } catch {
                        await noHandlerApiInstance.post(appConfig.serverMappings.logout).catch();
                        this.authStateManager.logout();
                    }
                }

                return Promise.reject(err);
            }
        );

        return globalInstance;
    }

    private static createRawApiInstance () {
        return axios.create({
            baseURL: appConfig.serverMappings.apiHost,
            withCredentials: true
        });
    }

}

export default AxiosApiManager;