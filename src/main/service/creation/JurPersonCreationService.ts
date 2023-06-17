import {JurPersonCreationParams} from "../../redux/creation/CreationCoreActions";
import ApiRequestManager, {HttpMethod} from "../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../config/appConfig";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import CreationService from "./CreationService";

class JurPersonCreationService implements CreationService<JurPerson, JurPersonCreationParams> {
    async create(params: JurPersonCreationParams): Promise<JurPerson> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const response: Response = await apiRequestManager
            .url(appConfig.serverMappings.jurPersons)
            .method(HttpMethod.POST)
            .body(JSON.stringify(params))
            .fetch();

        if (response.ok) {
            return await response.json() as JurPerson;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}

export default JurPersonCreationService;