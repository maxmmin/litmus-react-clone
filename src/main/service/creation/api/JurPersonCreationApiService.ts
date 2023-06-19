import {JurPersonCreationParams} from "../../../redux/actions/CreationCoreActions";
import ApiRequestManager, {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import appConfig from "../../../config/appConfig";
import {BasicHttpError} from "../../../error/BasicHttpError";
import {JurPerson} from "../../../model/jurPerson/JurPerson";
import CreationApiService from "./CreationApiService";
import {Location} from "../../../model/Location";
import {isEmpty} from "../../../util/isEmpty";
import {DateBuilder} from "../../../model/DateEntity";

type JurPersonCreationApiDto = {
    benOwnerId?: string,
    dateOfRegistration?:  string,
    edrpou?:  string,
    name?: string,
    ownerId?: string,
    location?: Location
}

class JurPersonCreationApiService implements CreationApiService<JurPerson, JurPersonCreationParams> {
    private readonly getAccessToken: ()=>string;

    constructor(getAccessToken: () => string) {
        this.getAccessToken = getAccessToken;
    }

    async create(params: JurPersonCreationParams): Promise<JurPerson> {
        const apiRequestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();


        const dto: JurPersonCreationApiDto = this.getApiDto(params);

        const response: Response = await apiRequestManager
            .url(appConfig.serverMappings.jurPersons)
            .method(HttpMethod.POST)
            .body(JSON.stringify(dto))
            .authentication(accessToken)
            .fetch();

        if (response.ok) {
            return await response.json() as JurPerson;
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }

    private getApiDto (params: JurPersonCreationParams): JurPersonCreationApiDto {
        const dto: Partial<JurPersonCreationApiDto> = {};

        if (!isEmpty(params.benOwner)) {
            dto.benOwnerId = params.benOwner!.id;
        }

        if (!isEmpty(params.owner)) {
            dto.benOwnerId = params.owner!.id;
        }

        if (!isEmpty(params.edrpou)) {
            dto.edrpou = params.edrpou;
        }

        if (!isEmpty(params.location)) {
            dto.location = params.location!;
        }

        if (!isEmpty(params.dateOfRegistration)) {
            dto.dateOfRegistration = DateBuilder.buildStringFrom(params.dateOfRegistration);
        }

        if (!isEmpty(params.name)) {
            dto.name = params.name;
        }

        return dto;
    }
}

export default JurPersonCreationApiService;