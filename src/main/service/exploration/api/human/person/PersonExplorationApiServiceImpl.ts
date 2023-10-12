import PersonExplorationApiService from "./PersonExplorationApiService";
import appConfig from "../../../../../config/appConfig";
import HumanExplorationApiServiceImpl from "../HumanExplorationApiServiceImpl";
import PersonResponseDto, {
    RelationshipsInfoResponseDto
} from "../../../../../rest/dto/person/PersonResponseDto";
import {buildUrl} from "../../../../../util/pureFunctions";
export type PersonResponseIdMapDto = Record<number, PersonResponseDto|null>

class PersonExplorationApiServiceImpl extends HumanExplorationApiServiceImpl<PersonResponseDto> implements PersonExplorationApiService {

    constructor() {
        super(appConfig.serverMappings.persons.root);
    }

    async findPersons(idSet: Set<number>, d: number): Promise<PersonResponseIdMapDto> {
        const response = await this.apiInstance<PersonResponseIdMapDto>(buildUrl(appConfig.serverMappings.persons.getByIdList), {
            params: {
                d: d,
                id: [...idSet]
            },
            paramsSerializer: {
                indexes: null
            }
        });
        return response.data;
    }



    async findPersonByIdWithDepthOption(id: string, d: number): Promise<PersonResponseDto> {
        const response = await this.apiInstance<PersonResponseDto>(buildUrl(appConfig.serverMappings.persons.root,id), {
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
        return response.data;
    }

    public static getInstance (): PersonExplorationApiServiceImpl {
        return new PersonExplorationApiServiceImpl();
    }

}

export default PersonExplorationApiServiceImpl;