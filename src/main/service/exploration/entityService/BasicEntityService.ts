/**
 * E - entity
 * service which provides shared methods
 */
import EntityService from "./EntityService";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import {BasicHttpError} from "../../../util/HttpStatus";
import {buildUrl} from "../../../util/pureFunctions";

class BasicEntityService<E> implements EntityService<E>{
    protected readonly apiUrl: string;
    protected readonly getAccessToken: ()=>string;

    constructor(apiUrl: string, getToken: ()=>string) {
        this.apiUrl = apiUrl;
        this.getAccessToken = getToken;
    }

    async findById(id: string): Promise<E> {
        const requestManager = new BasicApiRequestManager();
        const accessToken = this.getAccessToken();
        const response = await requestManager
            .url(buildUrl(this.apiUrl, id))
            .method(HttpMethod.GET)
            .authentication(accessToken)
            .fetch();
        if (!response.ok) {
            throw new BasicHttpError(response.status, await BasicHttpError.getHttpErrorResponse(response));
        } else {
            return await response.json().catch(()=>null) as E;
        }
    }
}

export default BasicEntityService;