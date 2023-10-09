import JurPersonExplorationApiService from "./JurPersonExplorationApiService";
import appConfig from "../../../../config/appConfig";
import BasicEntityLookupService from "../BasicExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import JurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import jurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import axiosApiInstance from "../../../rest/AxiosApiManager";

class JurPersonExplorationApiServiceImpl extends BasicEntityLookupService<jurPersonResponseDto> implements JurPersonExplorationApiService {

    constructor() {
        super(appConfig.serverMappings.jurPersons.root);
    }

    public static getInstance (): JurPersonExplorationApiServiceImpl {
        return new JurPersonExplorationApiServiceImpl();
    }

    async findByName(name: string): Promise<PagedData<JurPersonResponseDto>> {

        const params: {name?: string} = {}
        if (name) params.name = name;

        const response = await this.apiInstance.get<PagedData<JurPersonResponseDto>>(this.apiUrl, {
            params: params
        });

        return response.data;
    }


}

export default JurPersonExplorationApiServiceImpl;