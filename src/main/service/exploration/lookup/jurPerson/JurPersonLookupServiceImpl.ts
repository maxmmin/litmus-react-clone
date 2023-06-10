import JurPersonLookupService from "./JurPersonLookupService";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import appConfig from "../../../../config/appConfig";
import {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../../util/apiRequest/BasicApiRequestManager";
import {BasicHttpError} from "../../../../util/apiRequest/BasicHttpError";
import BasicEntityLookupService from "../BasicLookupService";

class JurPersonLookupServiceImpl extends BasicEntityLookupService<JurPerson> implements JurPersonLookupService {

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
            throw await BasicHttpError.getHttpErrorFromResponse(response);
        } else {
            return await response.json() as JurPerson[];
        }
    }


}

export default JurPersonLookupServiceImpl;