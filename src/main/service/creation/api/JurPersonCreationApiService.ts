import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError} from "../../../error/BasicHttpError";
import CreationApiService from "./CreationApiService";
import JurPersonRequestDto from "../../../rest/dto/jurPerson/JurPersonRequestDto";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import {inject} from "inversify";
import IOC_TYPES from "../../../inversify/IOC_TYPES";
import AuthenticationStateManager from "../../auth/stateManager/AuthenticationStateManager";


class JurPersonCreationApiService implements CreationApiService<JurPersonRequestDto, JurPersonResponseDto> {
    private readonly getAccessToken: ()=>string = ()=>this.authStateManager.getAuth()!.accessToken;

    constructor(@inject(IOC_TYPES.auth.AuthStateManager) private readonly authStateManager: AuthenticationStateManager) {
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
            throw await BasicHttpError.parseResponse(response);
        }
    }
}

export default JurPersonCreationApiService;