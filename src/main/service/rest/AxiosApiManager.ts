import axios, {AxiosError, AxiosInstance} from "axios";
import appConfig from "../../config/appConfig";
import {HttpStatus} from "../../rest/HttpStatus";
import AuthenticationStateManager from "../auth/stateManager/AuthenticationStateManager";
import ErrorResponse from "../../rest/ErrorResponse";
import AuthenticationStateManagerImpl from "../auth/stateManager/AuthenticationStateManagerImpl";
import {HttpMethod} from "../../util/apiRequest/ApiRequestManager";

class AxiosApiManager {
    public static csrfProtectedMethods: HttpMethod[] = [HttpMethod.PATCH, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PUT]

    private static csrfHeader: string = "X-XSRF-TOKEN";

    private static readonly authStateManager: AuthenticationStateManager = new AuthenticationStateManagerImpl();

    private static csrfToken: string|undefined;

    private static readonly _globalApiInstance: AxiosInstance = this.createApiInstance();

    public static setCsrfToken (csrfToken: string) {
        this.csrfToken = csrfToken;
        this
            .csrfProtectedMethods
            .forEach(method => {
                (this._globalApiInstance.defaults.headers[method.toLowerCase()] as Record<string, string>)[this.csrfHeader] = csrfToken
            })
        console.log(this._globalApiInstance.defaults.headers)
    }

    public static setCsrfHeader (csrfHeader: string) {
        // this.csrfHeader = csrfHeader;
        // if (this.csrfToken) this.setCsrfToken(this.csrfToken);
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
            xsrfCookieName: "",
            xsrfHeaderName: "",
            withCredentials: true
        });
    }

}

export default AxiosApiManager;