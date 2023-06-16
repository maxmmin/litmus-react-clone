/**
 * E - entity
 * creation which provides shared methods
 */
import LookupService from "./LookupService";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import {BasicHttpError} from "../../../util/apiRequest/BasicHttpError";
import {buildUrl} from "../../../util/pureFunctions";

class BasicEntityLookupService<E> implements LookupService<E>{
    protected readonly apiUrl: string;
    protected readonly getAccessToken: ()=>string;

    constructor(apiUrl: string, getToken: ()=>string) {
        this.apiUrl = apiUrl;
        this.getAccessToken = getToken;
    }

    async findById(id: string): Promise<E> {
        const requestManager: ApiRequestManager = new BasicApiRequestManager();
        const accessToken = this.getAccessToken();
        const response = await requestManager
            .url(buildUrl(this.apiUrl, id))
            .method(HttpMethod.GET)
            .authentication(accessToken)
            .fetch();
        if (!response.ok) {
            throw await BasicHttpError.parseResponse(response);
        } else {
            return await response.json().catch(()=>null) as E;
        }
    }
}

export default BasicEntityLookupService;