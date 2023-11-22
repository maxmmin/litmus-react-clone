import HumanExplorationApiService from "./HumanExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import BasicEntityLookupService from "../BasicExplorationApiService";
import {isEmpty} from "../../../../util/functional/isEmpty";
import {FullNameExploration} from "../../../../model/human/Human";
import {buildUrl} from "../../../../util/pureFunctions";
import appConfig from "../../../../config/appConfig";


export default class HumanExplorationApiServiceImpl<P extends object, S extends object> extends BasicEntityLookupService<P,S> implements HumanExplorationApiService<P, S> {

    constructor(apiMapping: string) {
        super(apiMapping);
    }

    async findByFullName(fullName: FullNameExploration, i: number): Promise<PagedData<S>> {
        const params: {i: number} = {i, ...fullName};

        const response = await
            this.apiInstance.get<PagedData<S>>(buildUrl(this.apiUrl, appConfig.serverMappings.relativeMappings.getByFullName), {
            params: params
        })

        return response.data;
    }
}