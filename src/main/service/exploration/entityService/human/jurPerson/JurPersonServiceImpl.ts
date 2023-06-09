import JurPersonService from "./JurPersonService";
import {JurPerson} from "../../../../../model/jurPerson/JurPerson";
import appConfig from "../../../../../config/appConfig";
import {HttpMethod} from "../../../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../../../util/apiRequest/BasicApiRequestManager";
import {BasicHttpError} from "../../../../../util/HttpStatus";
import BasicEntityService from "../../BasicEntityService";

class JurPersonServiceImpl extends BasicEntityService<JurPerson> implements JurPersonService {

    constructor(getToken: ()=>string, apiMapping: string = appConfig.serverMappings.jurPersons) {
        super(apiMapping, getToken);
    }

    async findByName(name: string): Promise<JurPerson[]> {
        const requestManager = new BasicApiRequestManager();

        const token = this.getAccessToken();

        const response = await requestManager
            .url(this.apiUrl)
            .setQueryParam("name", name)
            .method(HttpMethod.GET)
            .authentication(token)
            .fetch();
        if (!response.ok) {
            throw new BasicHttpError(response.status, await BasicHttpError.getHttpErrorResponse(response));
        } else {
            return await response.json() as JurPerson[];
        }
    }


}

export default JurPersonServiceImpl;