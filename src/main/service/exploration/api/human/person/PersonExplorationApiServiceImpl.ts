import PersonExplorationApiService from "./PersonExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import PersonResponseDto, {
    RelationshipResponseDto,
    RelationshipsInfoResponseDto
} from "../../../../../rest/dto/person/PersonResponseDto";
import {buildUrl} from "../../../../../util/pureFunctions";
import {RelationshipsInfo} from "../../../../../model/human/person/Person";
class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<PersonResponseDto> implements PersonExplorationApiService {

    constructor() {
        super(appConfig.serverMappings.persons.root);
    }

    async findPersons(idArray: Array<string>, d: number): Promise<RelationshipsInfoResponseDto> {
        const response = await this.apiInstance<PersonResponseDto>(buildUrl(this.apiUrl,id), {
            params: {
                d: d
            }
        });
        return response.data;
    }



    async findPersonByIdWithDepthOption(id: string, d: number): Promise<PersonResponseDto> {
        const response = await this.apiInstance<PersonResponseDto>(buildUrl(this.apiUrl,id), {
            params: {
                d: d
            }
        });
        return response.data;
    }

    async findPersonRelationships(id: string, d: number): Promise<RelationshipsInfoResponseDto> {
        const response = await this.apiInstance<RelationshipsInfoResponseDto>(buildUrl(appConfig.serverMappings.persons.relationships(id)), {
            params: {
                d: d
            }
        });
        return Promise.resolve(response.data);
    }

    public static getInstance (): PersonExplorationApiServiceImpl {
        return new PersonExplorationApiServiceImpl();
    }

}

export default PersonExplorationApiServiceImpl;