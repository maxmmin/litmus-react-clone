

import AuthApiService, {Credentials} from "./AuthApiService";
import appConfig from "../../../config/appConfig";
import {HttpErrorParser} from "../../../error/BasicHttpError";
import {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import AxiosApiManager from "../../rest/AxiosApiManager";
import Authentication from "../../../redux/types/auth/Authentication";

class BasicAuthApiService implements AuthApiService {

    private readonly axiosInstance: AxiosInstance = AxiosApiManager.globalApiInstance;

    async getAuth(credentials: Credentials): Promise<void> {
        await this.axiosInstance
            .post<Authentication, AxiosResponse<void>, Credentials>(appConfig.serverMappings.auth.signIn, credentials)
            .catch((err: AxiosError)=>{
                throw HttpErrorParser.parseAxiosError(err);
            });
    }


    async refreshAuth(): Promise<void> {
        await this.axiosInstance
            .post<any,AxiosResponse<void>>(appConfig.serverMappings.auth.refreshTokens, {})
            .catch((err: AxiosError)=>{
                throw HttpErrorParser.parseAxiosError(err);
            });
    }

    async logOut(): Promise<void> {
        await this.axiosInstance
            .post<any,AxiosResponse<void>>(appConfig.serverMappings.auth.logout, {})
            .catch((err: AxiosError)=>{
                throw HttpErrorParser.parseAxiosError(err);
            });
        return Promise.resolve();
    }



}

export default BasicAuthApiService;