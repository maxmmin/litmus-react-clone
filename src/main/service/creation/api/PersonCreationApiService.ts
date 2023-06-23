import Person from "../../../model/human/person/Person";
import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError} from "../../../error/BasicHttpError";
import CreationApiService from "./CreationApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";
import AuthenticationStateManager from "../../auth/stateManager/AuthenticationStateManager";
import {inject} from "inversify";
import IOC_TYPES from "../../../inversify/IOC_TYPES";

class PersonCreationApiService implements CreationApiService<PersonRequestDto, PersonResponseDto> {
    private readonly getAccessToken: ()=>string = ()=>this.authStateManager.getAuth()!.accessToken;

    constructor(@inject(IOC_TYPES.auth.AuthStateManager) private readonly authStateManager: AuthenticationStateManager) {
    }

    async create(dto: PersonRequestDto): Promise<PersonResponseDto> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();

        const response: Response = await apiRequestManager
            .url(appConfig.serverMappings.persons)
            .method(HttpMethod.POST)
            .body(JSON.stringify(dto))
            .authentication(accessToken)
            .fetch();

        if (response.ok) {
            return await response.json() as PersonResponseDto;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}

export default PersonCreationApiService;