
import ExplorationApiService from "./ExplorationApiService";
import {buildUrl} from "../../../util/pureFunctions";
import PagedData from "../../../rest/PagedData";
import AxiosApiManager from "../../rest/AxiosApiManager";

/**
 * P - ResponseDto
 * S - SimpleResponseDto
 */
class BasicEntityLookupService<P extends object, S extends object> implements ExplorationApiService<P, S>{
    protected readonly apiUrl: string;

    protected readonly apiInstance = AxiosApiManager.globalApiInstance;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async findById(id: number): Promise<P|null> {
        const response = await this.apiInstance<P>(buildUrl(this.apiUrl,id.toString()));
        return Object.keys(response.data).length>0?response.data:null;
    }

    async findSimpleById(id: number): Promise<S | null> {
        const response = await this.apiInstance<S>(buildUrl(this.apiUrl,id.toString()), {
            params: {
                s: true
            }
        });
        return Object.keys(response.data).length>0?response.data:null;
    }

    async findAll(i: number): Promise<PagedData<S>> {
        const response = await this.apiInstance.get<PagedData<S>>(this.apiUrl, {
            params: {i: i}
        });
        return response.data;
    }
}

export default BasicEntityLookupService;