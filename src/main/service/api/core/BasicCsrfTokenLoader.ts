import CsrfTokenLoader, {CsrfResponse} from "./CsrfTokenLoader";
import AxiosApiInstanceFactory from "./AxiosApiManager";
import appConfig from "../../../config/appConfig";

export default class BasicCsrfTokenLoader implements CsrfTokenLoader {
    protected readonly apiInstance = AxiosApiInstanceFactory.globalApiInstance;
    async loadCsrfToken(): Promise<CsrfResponse> {
        const token = await this.apiInstance.get<CsrfResponse>(appConfig.serverMappings.csrfToken);
        return token.data;
    };

}