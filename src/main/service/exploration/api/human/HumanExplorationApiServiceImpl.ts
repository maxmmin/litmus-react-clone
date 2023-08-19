import HumanExplorationApiService from "./HumanExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import BasicEntityLookupService from "../BasicExplorationApiService";
import appConfig from "../../../../config/appConfig";
import BasicApiRequestManager from "../../../../util/apiRequest/BasicApiRequestManager";
import ApiRequestManager, {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import {BasicHttpError} from "../../../../error/BasicHttpError";
import {isEmpty} from "../../../../util/isEmpty";
import FullName from "../../FullName";

export default class HumanExplorationApiServiceImpl<P> extends BasicEntityLookupService<P> implements HumanExplorationApiService<P> {

    constructor(getToken: () => string, apiMapping: string) {
        super(getToken, apiMapping);
    }

    async findByFullName(fullName: FullName): Promise<PagedData<P>> {
        const requestManager: ApiRequestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();

        requestManager
            .url(this.apiUrl)
            .method(HttpMethod.GET)
            .authentication(accessToken);

        if (fullName.firstName&&!isEmpty(fullName.firstName)) {
            requestManager.queryParam("firstName", fullName.firstName);
        }

        if (fullName.middleName&&!isEmpty(fullName.middleName)) {
            requestManager.queryParam("middleName", fullName.middleName);
        }

        if (fullName.lastName&&!isEmpty(fullName.lastName)) {
            requestManager.queryParam("lastName", fullName.lastName);
        }

        const response = await requestManager.fetch();
        if (response.ok) {
            return await response.json() as PagedData<P>
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}