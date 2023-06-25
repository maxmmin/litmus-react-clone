

import AuthApiService, {Credentials} from "./AuthApiService";
import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import appConfig from "../../../config/appConfig";
import Authentication from "../../../redux/types/auth/Authentication";
import {BasicHttpError} from "../../../error/BasicHttpError";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";

class BasicAuthApiService implements AuthApiService {
    async getAuth(credentials: Credentials): Promise<Authentication> {
        const requestManager: ApiRequestManager = new BasicApiRequestManager();
        const response = await requestManager
            .url(appConfig.serverMappings.signIn)
            .method(HttpMethod.POST)
            .body(JSON.stringify(credentials))
            .fetch();

        if (response.ok) {
            return await response.json() as Authentication;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }


    async refreshAuth(refreshToken:string): Promise<Authentication> {
        const requestManager: ApiRequestManager = new BasicApiRequestManager();
        const response = await requestManager
            .url(appConfig.serverMappings.refreshTokens)
            .method(HttpMethod.POST)
            .body(JSON.stringify({refreshToken}))
            .fetch();

        if (response.ok) {
            return await response.json() as Authentication;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }

}

export default BasicAuthApiService;