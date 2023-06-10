import ApiRequestManager, {HttpMethod} from "./ApiRequestManager";
import appConfig from "../../config/appConfig";


class BasicApiRequestManager implements ApiRequestManager {
    public fetchUrl: string|null = null;
    private authHeader = appConfig.authHeader;
    private init: RequestInit = this.getDefaultRequestInit();

    private getDefaultRequestInit (): RequestInit {
        return {headers: {}}
    }

    body(body: BodyInit): ApiRequestManager {
        this.init.body = body;
        return this;
    }

    setQueryParam(key: string, value: string|null): ApiRequestManager {
        let keyValue = `${key}=${value}`
        if (this.fetchUrl!==null) {
            if (this.fetchUrl.includes("?")) {
                keyValue="&"+keyValue;
            } else {
                keyValue = "?"+keyValue;
            }
            this.fetchUrl+=keyValue;
            return this;
        } else throw new Error("could not set url param because url is null")
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

    authentication(token: string): ApiRequestManager {
        (this.init.headers as Record<string, string>)[this.authHeader] = BasicApiRequestManager.createBearerToken(token);
        return this;
    }

    url(url: string): ApiRequestManager {
        this.fetchUrl = url;
        return this;
    }

    public static createBearerToken(token: string) {
        return "Bearer ".concat(token);
    }

}

export default BasicApiRequestManager;