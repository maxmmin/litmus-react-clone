import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError} from "../../../error/BasicHttpError";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import CreationApiService from "./CreationApiService";
import {Location} from "../../../model/Location";
import JurPersonCreationApiDto from "../mapper/dto/JurPersonCreationApiDto";


class JurPersonCreationApiService implements CreationApiService<JurPerson, JurPersonCreationApiDto> {
    private readonly getAccessToken: ()=>string;

    constructor(getAccessToken: () => string) {
        this.getAccessToken = getAccessToken;
    }

    async create(creationDto: JurPersonCreationApiDto): Promise<JurPerson> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();

        const response: Response = await apiRequestManager
            .url(appConfig.serverMappings.jurPersons)
            .method(HttpMethod.POST)
            .body(JSON.stringify(creationDto))
            .authentication(accessToken)
            .fetch();

        if (response.ok) {
            return await response.json() as JurPerson;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}

export default JurPersonCreationApiService;