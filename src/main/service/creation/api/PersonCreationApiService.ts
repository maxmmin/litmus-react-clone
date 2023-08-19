import ApiRequestManager, {ContentType, HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError, HttpErrorParser} from "../../../error/BasicHttpError";
import CreationApiService from "./CreationApiService";
import PersonRequestDto from "../../../rest/dto/person/PersonRequestDto";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";
import AuthenticationStateManager from "../../auth/stateManager/AuthenticationStateManager";


import AuthenticationStateManagerImpl from "../../auth/stateManager/AuthenticationStateManagerImpl";
import MediaEntityFormDataBuilder from "./multipartBuilder/MediaEntityFormDataBuilder";
import MediaEntityFormDataBuilderImpl from "./multipartBuilder/MediaEntityFormDataBuilderImpl";

class PersonCreationApiService implements CreationApiService<PersonRequestDto, PersonResponseDto> {
    constructor(private readonly authStateManager: AuthenticationStateManager, private readonly formDataBuilder: MediaEntityFormDataBuilder) {
    }

    public static getInstance (authManager: AuthenticationStateManager = new AuthenticationStateManagerImpl(),
                               formDataBuilder: MediaEntityFormDataBuilder = MediaEntityFormDataBuilderImpl.getInstance()): PersonCreationApiService {
        return new PersonCreationApiService(authManager, formDataBuilder);
    }

    async create(dto: PersonRequestDto): Promise<PersonResponseDto> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.authStateManager.getAuth()!.accessToken;

        const media = dto.media;

        delete dto.media;

        const formData = this.formDataBuilder.buildFormData(dto, media?media:null);

        const response: Response = await apiRequestManager
            .contentType(ContentType.UNSET)
            .url(appConfig.serverMappings.persons)
            .method(HttpMethod.POST)
            .body(formData)
            .authentication(accessToken)
            .fetch();

        if (response.ok) {
            return await response.json() as PersonResponseDto;
        } else {
            throw await HttpErrorParser.parseResponse(response);
        }
    }
}

export default PersonCreationApiService;