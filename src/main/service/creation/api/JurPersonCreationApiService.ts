import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError, HttpErrorParser} from "../../../error/BasicHttpError";
import CreationApiService from "./CreationApiService";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import AuthenticationStateManager from "../../auth/stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../../auth/stateManager/AuthenticationStateManagerImpl";


class JurPersonCreationApiService implements CreationApiService<JurPersonRequestDto, JurPersonResponseDto> {
    private readonly getAccessToken: ()=>string = ()=>this.authStateManager.getAuth()!.accessToken;

    constructor(private readonly authStateManager: AuthenticationStateManager) {
    }

    public static getInstance (authManager: AuthenticationStateManager = new AuthenticationStateManagerImpl()): JurPersonCreationApiService {
        return new JurPersonCreationApiService(authManager);
    }

    async create(creationDto: JurPersonRequestDto): Promise<JurPersonResponseDto> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();

        const response: Response = await apiRequestManager
            .url(appConfig.serverMappings.jurPersons)
            .method(HttpMethod.POST)
            .body(JSON.stringify(creationDto))
            .authentication(accessToken)
            .fetch();

        if (response.ok) {
            return await response.json() as JurPersonResponseDto;
        } else {
            throw await HttpErrorParser.parseResponse(response);
        }
    }
}

export default JurPersonCreationApiService;