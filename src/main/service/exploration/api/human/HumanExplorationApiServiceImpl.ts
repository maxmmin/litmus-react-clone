import HumanExplorationApiService from "./HumanExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import {FullName} from "../../FullName";
import BasicEntityLookupService from "../BasicExplorationApiService";
import appConfig from "../../../../config/appConfig";
import BasicApiRequestManager from "../../../../util/apiRequest/BasicApiRequestManager";
import ApiRequestManager, {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import {isEmpty} from "../../../../util/pureFunctions";
import {Human} from "../../../../model/human/Human";
import ErrorResponse from "../../../../rest/ErrorResponse";
import {BasicHttpError} from "../../../../error/BasicHttpError";

export default class HumanExplorationApiServiceImpl<E extends Human> extends BasicEntityLookupService<E> implements HumanExplorationApiService<E> {

    constructor(apiMapping: string = appConfig.serverMappings.users, getToken: () => string) {
        super(apiMapping, getToken);
    }

    async findByFullName(fullName: FullName): Promise<PagedData<E>> {
        const requestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();

        requestManager
            .url(this.apiUrl)
            .method(HttpMethod.GET)
            .authentication(accessToken);

        for (const key in fullName) {
            if (Object.hasOwn(fullName, key)&&!isEmpty(fullName[key])) {
                requestManager.setQueryParam(key,fullName[key]!);
            }
        }
        const response = await requestManager.fetch();
        if (response.ok) {
            return await response.json() as PagedData<E>
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}