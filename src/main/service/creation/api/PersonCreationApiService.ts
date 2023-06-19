import Person from "../../../model/human/person/Person";
import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError} from "../../../error/BasicHttpError";
import CreationApiService from "./CreationApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";

class PersonCreationApiService implements CreationApiService<Person, PersonRequestDto> {
    private readonly getAccessToken: ()=>string;

    constructor(getAccessToken: () => string) {
        this.getAccessToken = getAccessToken;
    }

    async create(dto: PersonRequestDto): Promise<Person> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();

        const response: Response = await apiRequestManager
            .url(appConfig.serverMappings.persons)
            .method(HttpMethod.POST)
            .body(JSON.stringify(dto))
            .authentication(accessToken)
            .fetch();

        if (response.ok) {
            return await response.json() as Person;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}

export default PersonCreationApiService;