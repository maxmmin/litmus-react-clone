

import AuthApiService, {Credentials} from "./AuthApiService";
import appConfig from "../../../config/appConfig";
import Authentication from "../../../redux/types/auth/Authentication";
import {HttpErrorParser} from "../../../error/BasicHttpError";
import axiosApiInstance from "../../../config/axiosApiInstance";
import {AxiosError, AxiosResponse} from "axios/index";

class BasicAuthApiService implements AuthApiService {
    async getAuth(credentials: Credentials): Promise<void> {
        await axiosApiInstance
            .post<Authentication, AxiosResponse<void>, Credentials>(appConfig.serverMappings.signIn, credentials)
            .catch((err: AxiosError)=>{
                throw HttpErrorParser.parseError(err);
            });
    }


    async refreshAuth(): Promise<void> {
        await axiosApiInstance
            .post<undefined,AxiosResponse<void>>(appConfig.serverMappings.refreshTokens)
            .catch((err: AxiosError)=>{
                throw HttpErrorParser.parseError(err);
            });
    }

}

export default BasicAuthApiService;