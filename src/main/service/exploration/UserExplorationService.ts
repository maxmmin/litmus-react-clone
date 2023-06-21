import DtoMapper from "../../rest/dto/dtoMappers/DtoMapper";
import PagedData, {UnPagedData} from "../../rest/PagedData";
import ExplorationService from "./ExplorationService";
import ExplorationStateManager from "./stateManager/ExplorationStateManager";
import EntityExplorationState from "../../redux/types/exploration/EntityExplorationState";
import {checkNotEmpty} from "../../util/pureFunctions";
import ExplorationMode from "../../redux/types/exploration/ExplorationMode";
import {createAsyncThunk} from "@reduxjs/toolkit";
import EntityExplorationData from "../../redux/types/exploration/EntityExplorationData";
import {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import UserExplorationParams from "../../redux/types/exploration/human/user/UserExplorationParams";
import {ExplorationTypedAction} from "../../redux/actions/ExplorationTypedAction";
import {ExplorationCoreAction} from "../../redux/actions/ExplorationActions";
import deepCopy from "../../util/deepCopy";
import handleCreationError from "../creation/handleCreationError";
import UserExplorationApiService from "./api/human/user/UserExplorationApiService";
import User from "../../model/human/user/User";
import UserResponseDto from "../../rest/dto/user/UserResponseDto";
import {inject, injectable} from "inversify";
import IOC_TYPES from "../../inversify/IOC_TYPES";
import UnsupportedModeError from "./UnsupportedModeError";

type UserExplorationCallbackType = (params: UserExplorationParams, service: UserExplorationApiService, mapper: DtoMapper<unknown, User, UserResponseDto>) => Promise<PagedData<User>>;

@injectable()
class UserExplorationService implements ExplorationService {
    private readonly mapper: DtoMapper<unknown, User, UserResponseDto>;
    private readonly stateManager: ExplorationStateManager<User, EntityExplorationState<User, UserExplorationParams>>
    private readonly service: UserExplorationApiService;


    constructor(@inject(IOC_TYPES.exploration.stateManagers.UserExplorationStateManager) stateManager: ExplorationStateManager<unknown, EntityExplorationState<User, UserExplorationParams>>,
                @inject(IOC_TYPES.exploration.UserExplorationService) service: UserExplorationApiService,
                @inject(IOC_TYPES.mappers.UserDtoMapper) mapper: DtoMapper<unknown, User, UserResponseDto>) {
        this.stateManager = stateManager;
        this.service = service;
        this.mapper = mapper;
    }

    private exploreByIdCallback: UserExplorationCallbackType = async (params, service, mapper) => {
        const id = checkNotEmpty(params.id);
        const content: User[] = []
        const userResponseDto: UserResponseDto|null = await service.findById(id);
        if (userResponseDto) {
            const user: User = mapper.mapToEntity(userResponseDto);
            content.push(user)
        };
        return new UnPagedData(content);
    }

    private exploreByFullNameCallback: UserExplorationCallbackType = async (params, service, mapper) => {
        const lastName = checkNotEmpty(params.lastName);
        const middleName = params.middleName;
        const firstName = params.firstName;
        const pagedResponse: PagedData<UserResponseDto> = await service.findByFullName({lastName, middleName, firstName});
        const userArray: User[] = pagedResponse.content.map(mapper.mapToEntity);
        return {...pagedResponse, content: userArray};
    }

    private callbackMap: Map<ExplorationMode, UserExplorationCallbackType>
        = new Map<ExplorationMode, UserExplorationCallbackType>(
        [
            [ExplorationMode.BY_FULL_NAME, this.exploreByFullNameCallback],
            [ExplorationMode.BY_ID, this.exploreByIdCallback]
        ],
    )

    async explore(): Promise<void> {
        this.stateManager.retrieveData(this.exploreUsersThunk({params: this.stateManager.getExplorationParams(), globalPending: false})).catch(console.error)
    }

    private async exploreUponMode (explorationParams: UserExplorationParams): Promise<PagedData<User>> {
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

    private exploreUsersThunk = createAsyncThunk<EntityExplorationData<User, UserExplorationParams>,
        ThunkArg<{params: UserExplorationParams}>,
        LitmusAsyncThunkConfig>(ExplorationTypedAction.user[ExplorationCoreAction.RETRIEVE_DATA],(async ({params}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response: PagedData<UserResponseDto> = await this.exploreUponMode(params);
            const exploredData: EntityExplorationData<User, UserExplorationParams> = {requestParams: params, response: response}
            return fulfillWithValue(deepCopy(exploredData), {notify: false});
        } catch (e: unknown) {
            return rejectWithValue(handleCreationError(e), {notify: true});
        }
    }))

}

export default UserExplorationService;