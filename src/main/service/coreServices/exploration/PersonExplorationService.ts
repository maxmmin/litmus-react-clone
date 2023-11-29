import ExplorationService from "./ExplorationService";
import PersonExplorationApiService from "../../api/person/exploration/PersonExplorationApiService";
import PagedData, {UnPagedData} from "../../../rest/PagedData";
import {PreProcessedPerson} from "../../../model/human/person/Person";
import PersonExplorationParams from "../../../redux/types/exploration/human/person/PersonExplorationParams";
import {createAsyncThunk} from "@reduxjs/toolkit";
import EntityExplorationData from "../../../redux/types/exploration/EntityExplorationData";
import {LitmusAsyncThunkConfig, ThunkArg} from "../../../redux/store";
import {ExplorationTypedAction} from "../../../redux/actions/ExplorationTypedAction";
import {ExplorationCoreAction} from "../../../redux/actions/ExplorationActions";
import serializableDeepCopy from "../../../util/functional/serializableDeepCopy";
import ExplorationMode from "../../../redux/types/exploration/ExplorationMode";
import {checkNotEmpty} from "../../../util/pureFunctions";
import PersonResponseDto from "../../../rest/dto/person/PersonResponseDto";
import DtoMapper from "../../dtoMappers/DtoMapper";


import UnsupportedModeError from "./UnsupportedModeError";
import PersonExplorationStateManager from "../../stateManagers/exploration/person/PersonExplorationStateManager";
import PersonExplorationStateManagerImpl from "../../stateManagers/exploration/person/PersonExplorationStateManagerImpl";
import PersonExplorationApiServiceImpl from "../../api/person/exploration/PersonExplorationApiServiceImpl";
import PersonDtoMapperImpl from "../../dtoMappers/person/PersonDtoMapperImpl";
import {PersonSimpleResponseDto} from "../../../rest/dto/person/PersonSimpleResponseDto";
import {PersonShortResponseDto} from "../../../rest/dto/person/PersonShortResponseDto";

type PersonExplorationMapper = DtoMapper<any, PreProcessedPerson, PersonResponseDto, any, PersonSimpleResponseDto, PersonShortResponseDto>

type PersonExplorationCallbackType = () => Promise<PagedData<PreProcessedPerson>>;

class PersonExplorationService implements ExplorationService {

    constructor(private readonly stateManager: PersonExplorationStateManager,
                private readonly service: PersonExplorationApiService,
                private readonly mapper: PersonExplorationMapper) {
    }

    public static getInstance (stateManager: PersonExplorationStateManager = new PersonExplorationStateManagerImpl(),
                               service: PersonExplorationApiService = PersonExplorationApiServiceImpl.getInstance(),
                               mapper: PersonExplorationMapper = PersonDtoMapperImpl.getInstance()): PersonExplorationService {
       return new PersonExplorationService(stateManager, service, mapper);
    }

    protected exploreById: PersonExplorationCallbackType = async () => {
        const id = checkNotEmpty(this.stateManager.getExplorationParams().id);
        const content: PreProcessedPerson[] = []
        const personResponseDto: PersonResponseDto|null = await this.service.findById(+id);
        if (personResponseDto) {
            const person: PreProcessedPerson = this.mapper.mapToEntity(personResponseDto);
            content.push(person)
        }
        return new UnPagedData(content);
    }

     protected exploreByFullName: PersonExplorationCallbackType = async () => {
        const params = this.stateManager.getExplorationParams();
        const lastName = params.lastName;
        const middleName = params.middleName;
        const firstName = params.firstName;
        const i = params.i;
        const pagedResponse: PagedData<PersonSimpleResponseDto> = await this.service.findByFullName({lastName, middleName, firstName}, i);
        const personArray: PreProcessedPerson[] = pagedResponse.content.map(person=>this.mapper.mapSimpleDtoToEntity(person));
        return {...pagedResponse, content: personArray};
    }

    protected exploreAll: PersonExplorationCallbackType = async () => {
        const i: number = this.stateManager.getExplorationParams().i;
        const pagedData: PagedData<PersonSimpleResponseDto> = await this.service.findAll(i);
        const personArray: PreProcessedPerson[] = pagedData.content.map(person=>this.mapper.mapSimpleDtoToEntity(person));
        return {...pagedData, content: personArray}
    }

    protected callbackMap: Map<ExplorationMode, PersonExplorationCallbackType>
        = new Map<ExplorationMode, PersonExplorationCallbackType>(
            [
                [ExplorationMode.BY_FULL_NAME, this.exploreByFullName],
                [ExplorationMode.BY_ID, this.exploreById],
                [ExplorationMode.FIND_ALL, this.exploreAll]
            ],
    )

    async explore(): Promise<void> {
        this.stateManager.retrieveData(this.explorePersonsThunk({params: this.stateManager.getExplorationParams(), globalPending: false})).catch(console.error)
    }

    protected async exploreUponMode (explorationParams: PersonExplorationParams): Promise<PagedData<PreProcessedPerson>> {
        const modeId = explorationParams.modeId;
        const mode: ExplorationMode = ExplorationMode.getModeById(modeId);
        const callback = this.callbackMap.get(mode);
        if (callback) {
            return callback.bind(this)();
        } else {
                if (explorationParams.supportedModesIdList.includes(modeId)) {
                    throw new Error("mod is supported by person exploration params but isn't present in switch branch")
                } else throw new UnsupportedModeError()
            }
        }

    protected explorePersonsThunk = createAsyncThunk<EntityExplorationData<PreProcessedPerson, PersonExplorationParams>,
        ThunkArg<{params: PersonExplorationParams}>,
        LitmusAsyncThunkConfig>(ExplorationTypedAction.person[ExplorationCoreAction.RETRIEVE_DATA],(async ({params}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response: PagedData<PreProcessedPerson> = await this.exploreUponMode(params);
            const exploredData: EntityExplorationData<PreProcessedPerson, PersonExplorationParams> = {requestParams: params, response: response}
            return fulfillWithValue(serializableDeepCopy(exploredData), {notify: false});
        } catch (e: unknown) {
            return rejectWithValue(serializableDeepCopy(e), {notify: true});
        }
    }))

}

export default PersonExplorationService;