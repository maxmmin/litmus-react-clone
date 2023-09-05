

import AuthApiService, {Credentials} from "./AuthApiService";
import appConfig from "../../../config/appConfig";
import {HttpErrorParser} from "../../../error/BasicHttpError";
import {AxiosError, AxiosResponse} from "axios";
import {AxiosInstance} from "axios";
import Authentication from "../../../redux/types/auth/Authentication";
import AxiosApiManager from "../../rest/AxiosApiManager";

class BasicAuthApiService implements AuthApiService {

    private readonly axiosInstance: AxiosInstance = AxiosApiManager.globalApiInstance;

    constructor() {

    }

    async getAuth(credentials: Credentials): Promise<void> {
        await this.axiosInstance
            .post<Authentication, AxiosResponse<void>, Credentials>(appConfig.serverMappings.signIn, credentials)
            .catch((err: AxiosError)=>{
                throw HttpErrorParser.parseError(err);
            });
    }


    async refreshAuth(): Promise<void> {
        await this.axiosInstance
            .post<undefined,AxiosResponse<void>>(appConfig.serverMappings.refreshTokens)
            .catch((err: AxiosError)=>{
                throw HttpErrorParser.parseError(err);
            });
    }

}

export default BasicAuthApiService;