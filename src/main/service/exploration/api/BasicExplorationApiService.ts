/**
 * E - entity
 * creation which provides shared methods
 */
import LookupService from "./ExplorationApiService";
import {buildUrl} from "../../../util/pureFunctions";
import axiosApiInstance from "../../rest/AxiosApiManager";
import AxiosApiManager from "../../rest/AxiosApiManager";

class BasicEntityLookupService<P> implements LookupService<P>{
    protected readonly apiUrl: string;

    protected readonly apiInstance = AxiosApiManager.globalApiInstance;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async findById(id: string): Promise<P> {
        const response = await this.apiInstance<P>(buildUrl(this.apiUrl,id));
        return response.data;
    }
}

export default BasicEntityLookupService;