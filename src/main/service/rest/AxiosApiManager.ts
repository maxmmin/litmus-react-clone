import axios, {AxiosError, AxiosInstance} from "axios";
import appConfig from "../../config/appConfig";
import {HttpStatus} from "../../rest/HttpStatus";
import AuthenticationStateManager from "../auth/stateManager/AuthenticationStateManager";
import ErrorResponse from "../../rest/ErrorResponse";
import AuthenticationStateManagerImpl from "../auth/stateManager/AuthenticationStateManagerImpl";
import {ContentType, HttpMethod} from "../../util/apiRequest/ApiRequestManager";

class AxiosApiManager {
    public static csrfProtectedMethods: HttpMethod[] = [HttpMethod.PATCH, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PUT]

    private static csrfHeader: string = "X-XSRF-TOKEN";

    private static readonly authStateManager: AuthenticationStateManager = new AuthenticationStateManagerImpl();

    private static csrfToken: string|undefined;

    private static readonly _globalApiInstance: AxiosInstance = this.createApiInstance();

    private static setCsrfTokenToInstance (axiosInstance: AxiosInstance, csrfToken: string): void {
        this
            .csrfProtectedMethods
            .forEach(method => {
                (axiosInstance.defaults.headers[method.toLowerCase()] as Record<string, string>)[this.csrfHeader] = csrfToken;
            })
    }

    public static setCsrfToken (csrfToken: string) {
        this.csrfToken = csrfToken;
        this.setCsrfTokenToInstance(this._globalApiInstance, csrfToken)
    }

    public static setCsrfHeader (csrfHeader: string) {
        this.csrfHeader = csrfHeader;
        if (this.csrfToken) this.setCsrfTokenToInstance(this.globalApiInstance,this.csrfToken);
    }

    static get globalApiInstance(): AxiosInstance {
        return this._globalApiInstance;
    }

    private static createApiInstance (): AxiosInstance {
        const globalInstance = this.createRawApiInstance();

        const manager = this.authStateManager;

        globalInstance.interceptors.response.use(
            (response) => response,
            async (err: AxiosError<ErrorResponse<unknown>>) => {
                const {config} = err;

                const noHandlerApiInstance = AxiosApiManager.createRawApiInstance();
                if (AxiosApiManager.csrfToken!==undefined) AxiosApiManager.setCsrfTokenToInstance(noHandlerApiInstance,AxiosApiManager.csrfToken);

                if (manager.isAuthenticated() && config && err.response?.status === HttpStatus.UNAUTHENTICATED) {

                    try {
                        await noHandlerApiInstance.post(appConfig.serverMappings.refreshTokens, {});
                    } catch {
                        await noHandlerApiInstance.post(appConfig.serverMappings.logout, {}).catch(console.error);
                        this.authStateManager.logout();
                        return Promise.reject(err);
                    }

                    return await globalInstance(config);
                }

                return Promise.reject(err);
            }
        );

        return globalInstance;
    }

    private static createRawApiInstance () {
        return  axios.create({
            baseURL: appConfig.serverMappings.apiHost,
            xsrfCookieName: "",
            xsrfHeaderName: "",
            withCredentials: true
        });
    }

}

export default AxiosApiManager;