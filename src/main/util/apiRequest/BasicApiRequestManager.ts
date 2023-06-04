import ApiRequestManager, {HttpMethod} from "./ApiRequestManager";
import appConfig from "../../config/appConfig";


class BasicApiRequestManager implements ApiRequestManager {
    private fetchUrl: string|null = null;
    private authHeader = appConfig.apiAuthHeader;
    private init: RequestInit = {}

    private getDefaultRequestInit () {
        return {}
    }

    body(body: BodyInit): ApiRequestManager {
        this.init.body = body;
        return this;
    }

    reset(): ApiRequestManager {
       this.fetchUrl = null;
       this.init = this.getDefaultRequestInit();
       return this;
    }

    fetch(): Promise<Response> {
        if (this.fetchUrl===null) {
            throw new Error("specify url before calling fetch")
        }
        return this.fetchWithParams(this.fetchUrl,this.init);
    }

    fetchWithParams(url: string, params: RequestInit): Promise<Response> {
       return fetch(url, params)
    }

    method(method: HttpMethod): ApiRequestManager {
        this.init.method = method;
        return this;
    }

    token(token: string): ApiRequestManager {
        (this.init.headers as Record<string, string>)[this.authHeader] = token;
        return this;
    }

    url(url: string): ApiRequestManager {
        this.fetchUrl = url;
        return this;
    }

}

export default BasicApiRequestManager;