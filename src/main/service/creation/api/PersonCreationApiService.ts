import Person from "../../../model/human/person/Person";
import {PersonCreationParams} from "../../../redux/creation/CreationCoreActions";
import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError} from "../../../util/apiRequest/BasicHttpError";
import CreationApiService from "./CreationApiService";

class PersonCreationApiService implements CreationApiService<Person, PersonCreationParams> {
    async create(params: PersonCreationParams): Promise<Person> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const response: Response = await apiRequestManager
            .url(appConfig.serverMappings.persons)
            .method(HttpMethod.POST)
            .body(JSON.stringify(params))
            .fetch();

        if (response.ok) {
            return await response.json() as Person;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}

export default PersonCreationApiService;