/**
 * E - entity
 * service which provides shared methods
 */
import EntityService from "./EntityService";
import BasicApiRequestManager from "../../util/apiRequest/BasicApiRequestManager";
import path from "path";
import {HttpMethod} from "../../util/apiRequest/ApiRequestManager";
import {BasicHttpError} from "../../util/HttpStatus";

class BasicEntityService<E> implements EntityService<E>{
    protected readonly apiUrl: string;
    protected readonly getAccessToken: ()=>string;

    constructor(apiUrl: string, getToken: ()=>string) {
        this.apiUrl = apiUrl;
        this.getAccessToken = getToken;
    }

    async findById(id: string): Promise<E> {
        const requestManager = new BasicApiRequestManager();
        this.getAccessToken();
        const response = await requestManager
            .url(path.join(this.apiUrl, id))
            .method(HttpMethod.GET)
            .fetch();
        if (!response.ok) {
            throw new BasicHttpError(response.status, await BasicHttpError.getHttpErrorResponse(response));
        } else {
            return await response.json() as E;
        }
    }
}

export default BasicEntityService;