import JurPersonExplorationApiService from "./JurPersonExplorationApiService";
import appConfig from "../../../../config/appConfig";
import ApiRequestManager, {HttpMethod} from "../../../../util/apiRequest/ApiRequestManager";
import {HttpErrorParser} from "../../../../error/BasicHttpError";
import BasicEntityLookupService from "../BasicExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import JurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import jurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import AuthenticationStateManager from "../../../auth/stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../../../auth/stateManager/AuthenticationStateManagerImpl";
import axiosApiInstance from "../../../../config/axiosApiInstance";

class JurPersonExplorationApiServiceImpl extends BasicEntityLookupService<jurPersonResponseDto> implements JurPersonExplorationApiService {


    constructor() {
        super(appConfig.serverMappings.jurPersons);
    }

    public static getInstance (): JurPersonExplorationApiServiceImpl {
        return new JurPersonExplorationApiServiceImpl();
    }

    async findByName(name: string): Promise<PagedData<JurPersonResponseDto>> {

        const params: {name?: string} = {}
        if (name) params.name = name;

        const response = await axiosApiInstance.get<PagedData<JurPersonResponseDto>>(this.apiUrl, {
            params: params
        });

        return response.data;
    }


}

export default JurPersonExplorationApiServiceImpl;