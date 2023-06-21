import HumanExplorationApiService from "./HumanExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import {FullName} from "../../FullName";
import BasicEntityLookupService from "../BasicExplorationApiService";
import appConfig from "../../../../config/appConfig";
import BasicApiRequestManager from "../../../../util/apiRequest/BasicApiRequestManager";
import ApiRequestManager, {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import {BasicHttpError} from "../../../../error/BasicHttpError";
import {isEmpty} from "../../../../util/isEmpty";

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

        for (const key in fullName) {
            if (Object.hasOwn(fullName, key)&&!isEmpty(fullName[key])) {
                requestManager.setQueryParam(key,fullName[key]!);
            }
        }
        const response = await requestManager.fetch();
        if (response.ok) {
            return await response.json() as PagedData<P>
        } else {
            throw await BasicHttpError.parseResponse(response);
        }
    }
}