import axios, {AxiosError, AxiosInstance} from "axios";
import appConfig from "../../../config/appConfig";
import {HttpStatus} from "../../../rest/HttpStatus";
import AuthenticationStateManager from "../../stateManagers/auth/AuthenticationStateManager";
import ErrorResponse from "../../../rest/ErrorResponse";
import AuthenticationStateManagerImpl from "../../stateManagers/auth/AuthenticationStateManagerImpl";
import {HttpMethod} from "../../../util/Http";

type CsrfResponse = {
    "token": string,
    "headerName": string,
    "parameterName": string
}

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
            async (err: AxiosError<ErrorResponse>) => {
                const {config} = err;

                const noAuthHandlerApiInstance = AxiosApiManager.createRawApiInstance();
                if (AxiosApiManager.csrfToken!==undefined) AxiosApiManager.setCsrfTokenToInstance(noAuthHandlerApiInstance,AxiosApiManager.csrfToken);

                if (manager.isAuthenticated() && config && err.response?.status === HttpStatus.UNAUTHENTICATED) {
                    try {
                        await noAuthHandlerApiInstance.post(appConfig.serverMappings.auth.refreshTokens, {});
                    } catch {
                        await noAuthHandlerApiInstance.post(appConfig.serverMappings.auth.logout, {}).catch(console.error);
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

    private static newClearInstance(): AxiosInstance {
        return axios.create({
            baseURL: appConfig.serverMappings.apiHost,
            xsrfCookieName: "",
            xsrfHeaderName: "",
            withCredentials: true
        });
    }
    private static createRawApiInstance (): AxiosInstance {
        const axiosInstance =  this.newClearInstance();

        axiosInstance.interceptors.response.use((response) => response,
            async (err: AxiosError<ErrorResponse>)=>{
                const {config} = err;

                try {
                    if (config&&err.response?.status===HttpStatus.FORBIDDEN) {
                        const errData = err.response?.data;
                        if (errData&&errData.type===appConfig.csrfErrCode) {
                            const csrfResponse = await axiosInstance.get<CsrfResponse>(appConfig.serverMappings.csrfToken, {});

                            const token = csrfResponse.data.token;

                            this.setCsrfToken(csrfResponse.data.token);
                            AxiosApiManager.setCsrfTokenToInstance(axiosInstance, token);

                            const clearInstance = this.newClearInstance();
                            AxiosApiManager.setCsrfTokenToInstance(clearInstance, token);

                            return await clearInstance.request(config)
                        }
                    }
                    return Promise.reject(err);
                } catch {
                    return Promise.reject(err);
                }
            })

        return axiosInstance;
    }

}

export default AxiosApiManager;