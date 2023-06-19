import JurPersonExplorationApiService from "./JurPersonExplorationApiService";
import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import appConfig from "../../../../config/appConfig";
import ApiRequestManager, {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../../util/apiRequest/BasicApiRequestManager";
import {BasicHttpError} from "../../../../error/BasicHttpError";
import BasicEntityLookupService from "../BasicExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import JurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import jurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";

class JurPersonExplorationApiServiceImpl extends BasicEntityLookupService<jurPersonResponseDto> implements JurPersonExplorationApiService {

    constructor(getToken: ()=>string, apiMapping: string = appConfig.serverMappings.jurPersons) {
        super(apiMapping, getToken);
    }

    async findByName(name: string): Promise<PagedData<JurPersonResponseDto>> {
        const requestManager: ApiRequestManager = new BasicApiRequestManager();

        const token = this.getAccessToken();

        const response = await requestManager
            .url(this.apiUrl)
            .setQueryParam("name", name)
            .method(HttpMethod.GET)
            .authentication(token)
            .fetch();
        if (!response.ok) {
            throw await BasicHttpError.parseResponse(response);
        } else {
            return await response.json() as PagedData<JurPersonResponseDto>;
        }
    }


}

export default JurPersonExplorationApiServiceImpl;