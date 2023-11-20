/**
 * E - entityPageComponents
 * creation which provides shared methods
 */
import ExplorationApiService from "./ExplorationApiService";
import {buildUrl} from "../../../util/pureFunctions";
import PagedData from "../../../rest/PagedData";
import AxiosApiManager from "../../rest/AxiosApiManager";

class BasicEntityLookupService<P extends object> implements ExplorationApiService<P>{
    protected readonly apiUrl: string;

    protected readonly apiInstance = AxiosApiManager.globalApiInstance;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async findById(id: number): Promise<P|null> {
        const response = await this.apiInstance<P>(buildUrl(this.apiUrl,id.toString()));
        return Object.keys(response.data).length>0?response.data:null;
    }

    async findAll(i: number): Promise<PagedData<P>> {
        const response = await this.apiInstance.get<PagedData<P>>(this.apiUrl, {
            params: {i: i}
        });
        return response.data;
    }
}

export default BasicEntityLookupService;