import HumanLookupService from "./HumanLookupService";
import PagedData from "../../../../util/apiRequest/PagedData";
import {FullName} from "../../FullName";
import BasicEntityLookupService from "../BasicLookupService";
import appConfig from "../../../../config/appConfig";
import BasicApiRequestManager from "../../../../util/apiRequest/BasicApiRequestManager";
import {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import {isEmpty} from "../../../../util/pureFunctions";
import {Human} from "../../../../model/human/Human";
import ErrorResponse from "../../../../util/apiRequest/ErrorResponse";
import {BasicHttpError} from "../../../../util/apiRequest/BasicHttpError";

export default class HumanLookupServiceImpl<E extends Human> extends BasicEntityLookupService<E> implements HumanLookupService<E> {

    constructor(apiMapping: string = appConfig.serverMappings.users, getToken: () => string) {
        super(apiMapping, getToken);
    }

    async findByFullName(fullName: FullName): Promise<PagedData<E>> {
        const requestManager = new BasicApiRequestManager();

        const accessToken = this.getAccessToken();

        requestManager
            .url(this.apiUrl)
            .method(HttpMethod.GET)
            .authentication(accessToken);

        for (const key in fullName) {
            if (Object.hasOwn(fullName, key)&&!isEmpty(fullName[key])) {
                requestManager.setQueryParam(key,fullName[key]);
            }
        }
        const response = await requestManager.fetch();
        if (response.ok) {
            return await response.json() as PagedData<E>
        } else {
            const error: ErrorResponse<ErrorResponse<any>>|null = await BasicHttpError.getHttpErrorFromResponse(response);
            if (error) {
                throw error;
            } else {
                throw new Error("Error " + response.status+" " + response.statusText)
            }

        }
    }
}