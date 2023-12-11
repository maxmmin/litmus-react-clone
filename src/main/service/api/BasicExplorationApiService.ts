
import ExplorationApiService from "./ExplorationApiService";
import {buildUrl} from "../../util/pureFunctions";
import PagedData from "../../rest/PagedData";
import AxiosApiManager from "./core/AxiosApiManager";
import {LookupMode} from "../../rest/LookupMode";
import appConfig from "../../config/appConfig";

/**
 * P - ResponseDto
 * S - SimpleResponseDto
 */
class BasicEntityLookupService<P extends object, S extends object, H extends object> implements ExplorationApiService<P, S, H>{
    protected readonly apiUrl: string;

    protected readonly apiInstance = AxiosApiManager.globalApiInstance;

    protected readonly lookupModeKey: string = appConfig.paramsConfig.lookupModeKeyName;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async findById(id: number): Promise<P|null> {
        const response = await this.apiInstance<P>(
            buildUrl(this.apiUrl,id.toString()),
            {
                params: {
                    [this.lookupModeKey]: LookupMode.DETAILED
                }
            }
        );
        return Object.keys(response.data).length>0?response.data:null;
    }

    async findSimpleById(id: number): Promise<S | null> {
        const response = await this.apiInstance<S>(buildUrl(this.apiUrl,id.toString()), {
            params: {
                [this.lookupModeKey]: LookupMode.SIMPLE
            }
        });
        return Object.keys(response.data).length>0?response.data:null;
    }

    async findShortById(id: number): Promise<H | null> {
        const response = await this.apiInstance<H>(buildUrl(this.apiUrl,id.toString()), {
            params: {
                [this.lookupModeKey]: LookupMode.SHORT,
            }
        });
        return Object.keys(response.data).length>0?response.data:null;
    }

    async findAll(i: number): Promise<PagedData<S>> {
        const response = await this.apiInstance.get<PagedData<S>>(this.apiUrl, {
            params: {[appConfig.paramsConfig.indexKeyName]: i}
        });
        return response.data;
    }
}

export default BasicEntityLookupService;