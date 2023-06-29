import JurPersonExplorationApiService from "./JurPersonExplorationApiService";
import appConfig from "../../../../config/appConfig";
import ApiRequestManager, {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../../util/apiRequest/BasicApiRequestManager";
import {BasicHttpError} from "../../../../error/BasicHttpError";
import BasicEntityLookupService from "../BasicExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import JurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import jurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import AuthenticationStateManager from "../../../auth/stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../../../auth/stateManager/AuthenticationStateManagerImpl";
class JurPersonExplorationApiServiceImpl extends BasicEntityLookupService<jurPersonResponseDto> implements JurPersonExplorationApiService {

    constructor(authStateManager: AuthenticationStateManager) {
        super(()=>authStateManager.getAuth()!.accessToken, appConfig.serverMappings.jurPersons);
    }

    public static getInstance (authStateManager: AuthenticationStateManager = new AuthenticationStateManagerImpl()): JurPersonExplorationApiServiceImpl {
        return new JurPersonExplorationApiServiceImpl(authStateManager);
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