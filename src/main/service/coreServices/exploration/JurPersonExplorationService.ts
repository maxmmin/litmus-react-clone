import DtoMapper from "../../dtoMappers/DtoMapper";
import PagedData, {UnPagedData} from "../../../rest/PagedData";
import ExplorationService from "./ExplorationService";
import ExplorationStateManager from "../../stateManagers/exploration/ExplorationStateManager";
import {checkNotEmpty} from "../../../util/pureFunctions";
import ExplorationMode from "../../../redux/types/exploration/ExplorationMode";
import {createAsyncThunk} from "@reduxjs/toolkit";
import EntityExplorationData from "../../../redux/types/exploration/EntityExplorationData";
import {LitmusAsyncThunkConfig, ThunkArg} from "../../../redux/store";
import {ExplorationTypedAction} from "../../../redux/actions/ExplorationTypedAction";
import {ExplorationCoreAction} from "../../../redux/actions/ExplorationActions";
import serializableDeepCopy from "../../../util/functional/serializableDeepCopy";
import BasicJurPersonExplorationParams from "../../../redux/types/exploration/jurPerson/BasicJurPersonExplorationParams";
import {PreProcessedJurPerson} from "../../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../../../rest/dto/jurPerson/JurPersonResponseDto";
import JurPersonExplorationApiService from "../../api/jur-person/exploration/JurPersonExplorationApiService";
import UnsupportedModeError from "./UnsupportedModeError";
import JurPersonExplorationParams from "../../../redux/types/exploration/jurPerson/JurPersonExplorationParams";
import JurPersonExplorationStateManager from "../../stateManagers/exploration/jurPerson/JurPersonExplorationStateManager";
import JurPersonExplorationStateManagerImpl from "../../stateManagers/exploration/jurPerson/JurPersonExplorationStateManagerImpl";
import JurPersonExplorationApiServiceImpl from "../../api/jur-person/exploration/JurPersonExplorationApiServiceImpl";
import JurPersonDtoMapperImpl from "../../dtoMappers/jurPerson/JurPersonDtoMapperImpl";
import {JurPersonSimpleResponseDto} from "../../../rest/dto/jurPerson/JurPersonSimpleResponseDto";
import {JurPersonShortResponseDto} from "../../../rest/dto/jurPerson/JurPersonShortResponseDto";

type JurPersonExplorationMapper = DtoMapper<any, PreProcessedJurPerson, JurPersonResponseDto,any, JurPersonSimpleResponseDto, JurPersonShortResponseDto>

type JurPersonExplorationCallbackType = () => Promise<PagedData<PreProcessedJurPerson>>;

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

    private exploreById: JurPersonExplorationCallbackType = async () => {
        const id = checkNotEmpty(this.stateManager.getExplorationParams().id);
        const content: PreProcessedJurPerson[] = []
        const jurPersonResponseDto: JurPersonSimpleResponseDto|null = await this.service.findSimpleById(+id);
        if (jurPersonResponseDto) {
            const jurPerson: PreProcessedJurPerson = this.mapper.mapSimpleDtoToEntity(jurPersonResponseDto);
            content.push(jurPerson)
        }
        return new UnPagedData(content);
    }

    private exploreAll: JurPersonExplorationCallbackType = async () => {
        const i: number = this.stateManager.getExplorationParams().i;
        const pagedData: PagedData<JurPersonSimpleResponseDto> = await this.service.findAll(i);
        const jurPersonArray: PreProcessedJurPerson[] = pagedData.content.map(jurPerson=>this.mapper.mapSimpleDtoToEntity(jurPerson));
        return {...pagedData, content: jurPersonArray}
    }

    private exploreByName: JurPersonExplorationCallbackType = async () => {
        const params = this.stateManager.getExplorationParams();
        const pagedData: PagedData<JurPersonSimpleResponseDto> = await this.service.findByName(params.name, params.i);
        const jurPersonArray: PreProcessedJurPerson[] = pagedData.content.map(jurPerson=>this.mapper.mapSimpleDtoToEntity(jurPerson));
        return {...pagedData, content: jurPersonArray}
    }

    private callbackMap: Map<ExplorationMode, JurPersonExplorationCallbackType>
        = new Map<ExplorationMode, JurPersonExplorationCallbackType>(
        [
            [ExplorationMode.BY_ID, this.exploreById],
            [ExplorationMode.FIND_ALL, this.exploreAll],
            [ExplorationMode.BY_JUR_NAME, this.exploreByName]
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
            return callback.bind(this)();
        } else {
            if (explorationParams.supportedModesIdList.includes(modeId)) {
                throw new Error("mod is supported by person exploration params but isn't present in switch branch")
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
