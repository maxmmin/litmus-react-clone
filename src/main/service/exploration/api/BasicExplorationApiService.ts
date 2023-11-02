/**
 * E - entityPageComponents
 * creation which provides shared methods
 */
import LookupService from "./ExplorationApiService";
import {buildUrl} from "../../../util/pureFunctions";
import axiosApiInstance from "../../rest/AxiosApiManager";
import AxiosApiManager from "../../rest/AxiosApiManager";

class BasicEntityLookupService<P extends object> implements LookupService<P>{
    protected readonly apiUrl: string;

    protected readonly apiInstance = AxiosApiManager.globalApiInstance;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async findById(id: string): Promise<P|null> {
        const response = await this.apiInstance<P>(buildUrl(this.apiUrl,id));
        return Object.keys(response.data).length>0?response.data:null;
    }
}

export default BasicEntityLookupService;