import DtoMapper from "../../dtoMappers/DtoMapper";
import PagedData, {UnPagedData} from "../../../rest/PagedData";
import ExplorationService from "./ExplorationService";
import {checkNotEmpty} from "../../../util/pureFunctions";
import ExplorationMode from "../../../redux/types/exploration/ExplorationMode";
import {createAsyncThunk} from "@reduxjs/toolkit";
import EntityExplorationData from "../../../redux/types/exploration/EntityExplorationData";
import {LitmusAsyncThunkConfig, ThunkArg} from "../../../redux/store";
import UserExplorationParams from "../../../redux/types/exploration/human/user/UserExplorationParams";
import {ExplorationTypedAction} from "../../../redux/actions/ExplorationTypedAction";
import {ExplorationCoreAction} from "../../../redux/actions/ExplorationActions";
import serializableDeepCopy from "../../../util/functional/serializableDeepCopy";
import UserExplorationApiService from "../../api/user/exploration/UserExplorationApiService";
import User from "../../../model/human/user/User";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import UnsupportedModeError from "./UnsupportedModeError";
import UserExplorationStateManager from "../../stateManagers/exploration/user/UserExplorationStateManager";
import UserExplorationStateManagerImpl from "../../stateManagers/exploration/user/UserExplorationStateManagerImpl";
import UserExplorationApiServiceImpl from "../../api/user/exploration/UserExplorationApiServiceImpl";
import UserDtoMapperImpl from "../../dtoMappers/user/UserDtoMapperImpl";
import userSimpleResponseDto from "../../../rest/dto/user/UserSimpleResponseDto";
import UserSimpleResponseDto from "../../../rest/dto/user/UserSimpleResponseDto";
import {UserShortResponseDto} from "../../../rest/dto/user/UserShortResponseDto";

type UserExplorationDtoMapper = DtoMapper<any, User, UserResponseDto, any, UserSimpleResponseDto, UserShortResponseDto>;

type UserExplorationCallbackType = () => Promise<PagedData<User>>;


class UserExplorationService implements ExplorationService {

    constructor(private readonly stateManager: UserExplorationStateManager,
                private readonly service: UserExplorationApiService,
                private readonly mapper: UserExplorationDtoMapper) {
    }

    public static getInstance (stateManager: UserExplorationStateManager = new UserExplorationStateManagerImpl(),
                               service: UserExplorationApiService = UserExplorationApiServiceImpl.getInstance(),
                               mapper: UserExplorationDtoMapper = UserDtoMapperImpl.getInstance(),
                                ): UserExplorationService {
        return new UserExplorationService(stateManager,service,mapper)
    }

    private exploreByIdCallback: UserExplorationCallbackType = async () => {
        const id = checkNotEmpty(this.stateManager.getExplorationParams().id);
        const content: User[] = []
        const userResponseDto: UserSimpleResponseDto|null = await this.service.findSimpleById(+id);
        if (userResponseDto) {
            const user: User = this.mapper.mapSimpleDtoToEntity(userResponseDto);
            content.push(user);
        }
        return new UnPagedData(content);
    }

    private exploreByFullNameCallback: UserExplorationCallbackType = async () => {
        const params = this.stateManager.getExplorationParams();
        const lastName = params.lastName;
        const middleName = params.middleName;
        const firstName = params.firstName;
        const i = params.i;
        const pagedResponse: PagedData<userSimpleResponseDto> = await this.service.findByFullName({lastName, middleName, firstName}, i);
        const userArray: User[] = pagedResponse.content.map(user=>this.mapper.mapSimpleDtoToEntity(user));
        return {...pagedResponse, content: userArray};
    }

    private exploreByEmailCallback: UserExplorationCallbackType = async () => {
        const email = this.stateManager.getExplorationParams().email;

        const userResponseDto: UserSimpleResponseDto|null = await this.service.findSimpleByEmail(email);
        const content: User[] = []
        if (userResponseDto) {
            content.push(this.mapper.mapSimpleDtoToEntity(userResponseDto))
        }
        return new UnPagedData(content);
    }

    private exploreAllCallback: UserExplorationCallbackType = async () => {
        const i = this.stateManager.getExplorationParams().i;
        const pagedResponse: PagedData<UserSimpleResponseDto> = await this.service.findAll(i);
        const userArray: User[] = pagedResponse.content.map(user=>this.mapper.mapSimpleDtoToEntity(user));
        return {...pagedResponse, content: userArray};
    }

    private callbackMap: Map<ExplorationMode, UserExplorationCallbackType>
        = new Map<ExplorationMode, UserExplorationCallbackType>(
        [
            [ExplorationMode.BY_FULL_NAME, this.exploreByFullNameCallback],
            [ExplorationMode.BY_ID, this.exploreByIdCallback],
            [ExplorationMode.FIND_ALL, this.exploreAllCallback],
            [ExplorationMode.BY_EMAIL, this.exploreByEmailCallback]
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
            return callback.bind(this)();
        } else {
            if (explorationParams.supportedModesIdList.includes(modeId)) {
                throw new Error("mod is supported by person exploration params but isn't present in switch branch")
            } else throw new UnsupportedModeError();}
    }

    private exploreUsersThunk = createAsyncThunk<EntityExplorationData<User, UserExplorationParams>,
        ThunkArg<{params: UserExplorationParams}>,
        LitmusAsyncThunkConfig>(ExplorationTypedAction.user[ExplorationCoreAction.RETRIEVE_DATA],(async ({params}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response: PagedData<User> = await this.exploreUponMode(params);
            const exploredData: EntityExplorationData<User, UserExplorationParams> = {requestParams: params, response: response}
            return fulfillWithValue(serializableDeepCopy(exploredData), {notify: false});
        } catch (e: unknown) {
            return rejectWithValue(serializableDeepCopy(e), {notify: true});
        }
    }))

}

export default UserExplorationService;