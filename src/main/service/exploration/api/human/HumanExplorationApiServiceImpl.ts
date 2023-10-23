import HumanExplorationApiService from "./HumanExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import BasicEntityLookupService from "../BasicExplorationApiService";
import {isEmpty} from "../../../../util/isEmpty";
import {FullName} from "../../../../model/human/Human";

export default class HumanExplorationApiServiceImpl<P> extends BasicEntityLookupService<P> implements HumanExplorationApiService<P> {

    constructor(apiMapping: string) {
        super(apiMapping);
    }

    async findByFullName(fullName: Partial<FullName>, i: number): Promise<PagedData<P>> {
        const params: Partial<{firstName: string, middleName: string, lastName: string}>&{i: number} = {i};

        if (fullName.firstName&&!isEmpty(fullName.firstName)) {
            params.firstName = fullName.firstName;
        }

        if (fullName.middleName&&!isEmpty(fullName.middleName)) {
            params.middleName = fullName.middleName;
        }

        if (fullName.lastName&&!isEmpty(fullName.lastName)) {
            params.lastName = fullName.lastName;
        }

        const response = await this.apiInstance.get<PagedData<P>>(this.apiUrl, {
            params: params
        })

        return response.data;
    }
}