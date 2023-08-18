import Person from "../../../model/human/person/Person";
import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError} from "../../../error/BasicHttpError";
import CreationApiService from "./CreationApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";
import AuthenticationStateManager from "../../auth/stateManager/AuthenticationStateManager";


import AuthenticationStateManagerImpl from "../../auth/stateManager/AuthenticationStateManagerImpl";
import MediaEntityFormDataBuilder from "./multipartBuilder/MediaEntityFormDataBuilder";
import MediaEntityFormDataBuilderImpl from "./multipartBuilder/MediaEntityFormDataBuilderImpl";

class PersonCreationApiService implements CreationApiService<PersonRequestDto, PersonResponseDto> {
    constructor(private readonly authStateManager: AuthenticationStateManager, formDataBuilder: MediaEntityFormDataBuilder) {
    }

    public static getInstance (authManager: AuthenticationStateManager = new AuthenticationStateManagerImpl(),
                               formDataBuilder: MediaEntityFormDataBuilder = MediaEntityFormDataBuilderImpl.getInstance()): PersonCreationApiService {
        return new PersonCreationApiService(authManager, formDataBuilder);
    }

    async create(dto: PersonRequestDto): Promise<PersonResponseDto> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.authStateManager.getAuth()!.accessToken;

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