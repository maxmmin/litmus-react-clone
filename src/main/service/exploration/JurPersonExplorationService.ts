import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import PagedData, {UnPagedData} from "../../rest/PagedData";
import ExplorationService from "./ExplorationService";
import ExplorationStateManager from "./stateManager/ExplorationStateManager";
import {checkNotEmpty} from "../../util/pureFunctions";
import ExplorationMode from "../../redux/types/exploration/ExplorationMode";
import {createAsyncThunk} from "@reduxjs/toolkit";
import EntityExplorationData from "../../redux/types/exploration/EntityExplorationData";
import {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import {ExplorationTypedAction} from "../../redux/actions/ExplorationTypedAction";
import {ExplorationCoreAction} from "../../redux/actions/ExplorationActions";
import serializableDeepCopy from "../../util/functional/serializableDeepCopy";
import BasicJurPersonExplorationParams from "../../redux/types/exploration/jurPerson/BasicJurPersonExplorationParams";
import jurPersonExplorationApiService from "./api/jurPerson/JurPersonExplorationApiService";
import {PreProcessedJurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../../rest/dto/jurPerson/JurPersonResponseDto";
import JurPersonExplorationApiService from "./api/jurPerson/JurPersonExplorationApiService";
import UnsupportedModeError from "./UnsupportedModeError";
import JurPersonExplorationParams from "../../redux/types/exploration/jurPerson/JurPersonExplorationParams";
import JurPersonExplorationStateManager from "./stateManager/jurPerson/JurPersonExplorationStateManager";
import JurPersonExplorationStateManagerImpl from "./stateManager/jurPerson/JurPersonExplorationStateManagerImpl";
import JurPersonExplorationApiServiceImpl from "./api/jurPerson/JurPersonExplorationApiServiceImpl";
import JurPersonDtoMapperImpl from "../../rest/dto/dtoMappers/JurPersonDtoMapperImpl";

type JurPersonExplorationMapper = DtoMapper<any, PreProcessedJurPerson, JurPersonResponseDto,any>

type JurPersonExplorationCallbackType = (params: JurPersonExplorationParams, service: jurPersonExplorationApiService, mapper: JurPersonExplorationMapper) => Promise<PagedData<PreProcessedJurPerson>>;

class JurPersonExplorationService implements ExplorationService {

    constructor(private readonly stateManager: ExplorationStateManager<PreProcessedJurPerson, JurPersonExplorationParams>,
                private readonly service: JurPersonExplorationApiService,
                private readonly mapper: JurPersonExplorationMapper) {
    }

    public static getInstance(stateManager: JurPersonExplorationStateManager = new JurPersonExplorationStateManagerImpl(),
                       service: JurPersonExplorationApiService = JurPersonExplorationApiServiceImpl.getInstance(),
                       mapper: JurPersonExplorationMapper = JurPersonDtoMapperImpl.getInstance(),
                    ) {
        return new JurPersonExplorationService(stateManager,service,mapper)
    }

    private exploreByIdCallback: JurPersonExplorationCallbackType = async (params, service, mapper) => {
        //@todo write the way to get all entities
        const id = checkNotEmpty(params.id);
        const content: PreProcessedJurPerson[] = []
        const jurPersonResponseDto: JurPersonResponseDto|null = await service.findById(id);
        if (jurPersonResponseDto) {
            const jurPerson: PreProcessedJurPerson = mapper.mapToEntity(jurPersonResponseDto);
            content.push(jurPerson)
        };
        return new UnPagedData(content);
    }

    private callbackMap: Map<ExplorationMode, JurPersonExplorationCallbackType>
        = new Map<ExplorationMode, JurPersonExplorationCallbackType>(
        [
            [ExplorationMode.BY_ID, this.exploreByIdCallback]
        ],
    )

    async explore(): Promise<void> {
        this.stateManager.retrieveData(this.exploreJurPersonsThunk({params: this.stateManager.getExplorationParams(), globalPending: false})).catch(console.error)
    }

    private async exploreUponMode (explorationParams: JurPersonExplorationParams): Promise<PagedData<PreProcessedJurPerson>> {
        const modeId = explorationParams.modeId;
        const mode: ExplorationMode = ExplorationMode.getModeById(modeId);
        const callback = this.callbackMap.get(mode);
        if (callback) {
            return callback(explorationParams, this.service, this.mapper);
        } else {
            if (explorationParams.supportedModesIdList.includes(modeId)) {
                throw new Error("mod is supported by person exploration params but isn't added to switch branch")
            } else throw new UnsupportedModeError();}
    }

    private exploreJurPersonsThunk = createAsyncThunk<EntityExplorationData<PreProcessedJurPerson, JurPersonExplorationParams>,
        ThunkArg<{params: BasicJurPersonExplorationParams}>,
        LitmusAsyncThunkConfig>(ExplorationTypedAction.jurPerson[ExplorationCoreAction.RETRIEVE_DATA],(async ({params}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response: PagedData<PreProcessedJurPerson> = await this.exploreUponMode(params);
            const exploredData: EntityExplorationData<PreProcessedJurPerson, JurPersonExplorationParams> = {requestParams: params, response: response}
            return fulfillWithValue(serializableDeepCopy(exploredData), {notify: false});
        } catch (e: unknown) {
            return rejectWithValue(serializableDeepCopy(e), {notify: true});
        }
    }))

}

export default JurPersonExplorationService;
