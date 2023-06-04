import JurPersonService from "./JurPersonService";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import appConfig from "../../../config/appConfig";
import {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import path from "path";
import {BasicHttpError} from "../../../util/HttpStatus";

class JurPersonServiceImpl implements JurPersonService {
    private readonly apiUrl: string = appConfig.apiMapping.jurPerson;

    constructor(getToken: ()=>string) {
        this.getAuthToken = getToken;
    }

    private getAuthToken: ()=>string;

    async findById(id: string): Promise<JurPerson> {
        const requestManager = new BasicApiRequestManager();
        const response = await requestManager
            .url(path.join(this.apiUrl, id))
            .method(HttpMethod.GET)
            .fetch();
        if (!response.ok) {
            throw new BasicHttpError(response.status, await BasicHttpError.getHttpErrorResponse(response));
        } else {
            return await response.json() as JurPerson;
        }
    }

    async findByName(name: string): Promise<JurPerson[]> {
        const requestManager = new BasicApiRequestManager();
        const response = await requestManager
            .url(this.apiUrl)
            .setQueryParam("name", name)
            .method(HttpMethod.GET)
            .fetch();
        if (!response.ok) {
            throw new BasicHttpError(response.status, await BasicHttpError.getHttpErrorResponse(response));
        } else {
            return await response.json() as JurPerson[];
        }
    }


}

export default JurPersonServiceImpl;