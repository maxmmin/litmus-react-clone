import HumanExplorationApiService from "./HumanExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import BasicEntityLookupService from "../BasicExplorationApiService";
import ApiRequestManager, {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import {BasicHttpError, HttpErrorParser} from "../../../../error/BasicHttpError";
import {isEmpty} from "../../../../util/isEmpty";
import FullName from "../../FullName";
import axiosApiInstance from "../../../../config/axiosApiInstance";
import appConfig from "../../../../config/appConfig";

export default class HumanExplorationApiServiceImpl<P> extends BasicEntityLookupService<P> implements HumanExplorationApiService<P> {

    constructor(getToken: () => string, apiMapping: string) {
        super(getToken, apiMapping);
    }

    async findByFullName(fullName: FullName): Promise<PagedData<P>> {
        const params: Partial<{firstName: string, middleName: string, lastName: string}> = {}


        if (fullName.firstName&&!isEmpty(fullName.firstName)) {
            params.firstName = fullName.firstName;
        }

        if (fullName.middleName&&!isEmpty(fullName.middleName)) {
            params.middleName = fullName.middleName;
        }

        if (fullName.lastName&&!isEmpty(fullName.lastName)) {
            params.lastName = fullName.lastName;
        }

        return  axiosApiInstance.get(this.apiUrl, {
            params: params
        })
    }
}