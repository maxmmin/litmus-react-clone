/**
 * E - entity
 * creation which provides shared methods
 */
import LookupService from "./ExplorationApiService";
import {buildUrl} from "../../../util/pureFunctions";
import axiosApiInstance from "../../../config/axiosApiInstance";

class BasicEntityLookupService<P> implements LookupService<P>{
    protected readonly apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async findById(id: string): Promise<P> {
        const response = await axiosApiInstance.get<P>(buildUrl(this.apiUrl,id));
        return response.data;
    }
}

export default BasicEntityLookupService;