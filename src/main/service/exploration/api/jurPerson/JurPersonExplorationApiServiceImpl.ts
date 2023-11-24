import JurPersonExplorationApiService from "./JurPersonExplorationApiService";
import appConfig from "../../../../config/appConfig";
import BasicEntityLookupService from "../BasicExplorationApiService";
import PagedData from "../../../../rest/PagedData";
import JurPersonResponseDto from "../../../../rest/dto/jurPerson/JurPersonResponseDto";
import {buildUrl} from "../../../../util/pureFunctions";
import {JurPersonSimpleResponseDto} from "../../../../rest/dto/jurPerson/JurPersonSimpleResponseDto";
import {JurPersonShortResponseDto} from "../../../../rest/dto/jurPerson/JurPersonShortResponseDto";

class JurPersonExplorationApiServiceImpl extends BasicEntityLookupService<JurPersonResponseDto, JurPersonSimpleResponseDto, JurPersonShortResponseDto>
    implements JurPersonExplorationApiService {

    constructor() {
        super(appConfig.serverMappings.jurPersons.root);
    }

    public static getInstance (): JurPersonExplorationApiServiceImpl {
        return new JurPersonExplorationApiServiceImpl();
    }

    async findByIdWithDepthOption(id: number, d: number): Promise<JurPersonResponseDto | null> {
        const response = await this.apiInstance<JurPersonResponseDto>(buildUrl(appConfig.serverMappings.jurPersons.root,id.toString()), {
            params: {
                d: d
            }
        });
        return Object.keys(response.data).length>0?response.data:null;
    }


    async findByName(name: string, i: number): Promise<PagedData<JurPersonSimpleResponseDto>> {

        const params = {
            i: i
        }

        const url = buildUrl(appConfig.serverMappings.jurPersons.getByName, encodeURIComponent(name));

        const response = await this.apiInstance.get<PagedData<JurPersonSimpleResponseDto>>(
            url, {
            params: params
        });

        return response.data;
    }


}

export default JurPersonExplorationApiServiceImpl;