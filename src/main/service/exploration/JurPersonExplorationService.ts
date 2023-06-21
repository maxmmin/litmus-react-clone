import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import PagedData, {UnPagedData} from "../../rest/PagedData";
import ExplorationService from "./ExplorationService";
import ExplorationStateManager from "./stateManager/ExplorationStateManager";
import EntityExplorationState from "../../redux/types/exploration/EntityExplorationState";
import {checkNotEmpty} from "../../util/pureFunctions";
import ExplorationMode from "../../redux/types/exploration/ExplorationMode";
import PersonExplorationParams from "../../redux/types/exploration/human/person/PersonExplorationParams";
import {createAsyncThunk} from "@reduxjs/toolkit";
import EntityExplorationData from "../../redux/types/exploration/EntityExplorationData";
import {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import {ExplorationTypedAction} from "../../redux/actions/ExplorationTypedAction";
import {ExplorationCoreAction} from "../../redux/actions/ExplorationActions";
import deepCopy from "../../util/deepCopy";
import handleCreationError from "../creation/handleCreationError";
import BasicJurPersonExplorationParams from "../../redux/types/exploration/jurPerson/BasicJurPersonExplorationParams";
import jurPersonExplorationApiService from "./api/jurPerson/JurPersonExplorationApiService";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../../rest/dto/jurPerson/JurPersonResponseDto";
import JurPersonExplorationApiService from "./api/jurPerson/JurPersonExplorationApiService";
import {inject, injectable} from "inversify";
import UnsupportedModeError from "./UnsupportedModeError";
import IOC_TYPES from "../../inversify/IOC_TYPES";

type JurPersonExplorationCallbackType = (params: BasicJurPersonExplorationParams, service: jurPersonExplorationApiService, mapper: DtoMapper<unknown, JurPerson, JurPersonResponseDto>) => Promise<PagedData<JurPerson>>;

@injectable()
class JurPersonExplorationService implements ExplorationService {
    private readonly mapper: DtoMapper<unknown, JurPerson, JurPersonResponseDto>;
    private readonly stateManager: ExplorationStateManager<JurPerson, EntityExplorationState<JurPerson, BasicJurPersonExplorationParams>>
    private readonly service: JurPersonExplorationApiService;


    constructor(@inject(IOC_TYPES.JurPersonExplorationStateManager) stateManager: ExplorationStateManager<JurPerson, EntityExplorationState<JurPerson, BasicJurPersonExplorationParams>>,
                @inject(IOC_TYPES.JurPersonExplorationApiService) service: JurPersonExplorationApiService,
                @inject(IOC_TYPES.JurPersonDtoMapper) mapper: DtoMapper<unknown, JurPerson, JurPersonResponseDto>) {
        this.mapper = mapper;
        this.stateManager = stateManager;
        this.service = service;
    }

    private exploreByIdCallback: JurPersonExplorationCallbackType = async (params, service, mapper) => {
        const id = checkNotEmpty(params.id);
        const content: JurPerson[] = []
        const jurPersonResponseDto: JurPersonResponseDto|null = await service.findById(id);
        if (jurPersonResponseDto) {
            const jurPerson: JurPerson = mapper.mapToEntity(jurPersonResponseDto);
            content.push(jurPerson)
        };
        return new UnPagedData(content);
    }

    private callbackMap: Map<ExplorationMode, JurPersonExplorationCallbackType>
        = new Map<ExplorationMode, JurPersonExplorationCallbackType>(
        [
            [ExplorationMode.BY_FULL_NAME, this.exploreByIdCallback],
            [ExplorationMode.BY_ID, this.exploreByIdCallback]
        ],
    )

    async explore(): Promise<void> {
        this.stateManager.retrieveData(this.exploreJurPersonsThunk({params: this.stateManager.getExplorationParams(), globalPending: false})).catch(console.error)
    }

    private async exploreUponMode (explorationParams: BasicJurPersonExplorationParams): Promise<PagedData<JurPerson>> {
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

    private exploreJurPersonsThunk = createAsyncThunk<EntityExplorationData<JurPerson, BasicJurPersonExplorationParams>,
        ThunkArg<{params: BasicJurPersonExplorationParams}>,
        LitmusAsyncThunkConfig>(ExplorationTypedAction.user[ExplorationCoreAction.RETRIEVE_DATA],(async ({params}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response: PagedData<JurPerson> = await this.exploreUponMode(params);
            const exploredData: EntityExplorationData<JurPerson, BasicJurPersonExplorationParams> = {requestParams: params, response: response}
            return fulfillWithValue(deepCopy(exploredData), {notify: false});
        } catch (e: unknown) {
            return rejectWithValue(handleCreationError(e), {notify: true});
        }
    }))

}

export default JurPersonExplorationService;