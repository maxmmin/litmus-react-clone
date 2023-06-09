import HumanService from "./HumanService";
import PagedData from "../PagedData";
import {FullName} from "../../FullName";
import BasicEntityService from "../BasicEntityService";
import appConfig from "../../../../config/appConfig";
import BasicApiRequestManager from "../../../../util/apiRequest/BasicApiRequestManager";
import {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import {isEmpty} from "../../../../util/pureFunctions";
import {Human} from "../../../../model/human/Human";

export default class BasicHumanService<E extends Human> extends BasicEntityService<E> implements HumanService<E> {

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
        return await response.json() as PagedData<E>;
    }
}