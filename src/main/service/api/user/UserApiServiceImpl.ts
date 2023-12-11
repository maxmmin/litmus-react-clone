import UserApiService from "./UserApiService";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import UserExplorationApiService from "./exploration/UserExplorationApiService";
import UserCreationApiService from "./creation/UserCreationApiService";
import {AxiosInstance} from "axios";
import AxiosApiManager from "../core/AxiosApiManager";
import PagedData from "../../../rest/PagedData";
import {FullNameExploration} from "../../../model/human/Human";
import {buildUrl} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";
import UserExplorationApiServiceImpl from "./exploration/UserExplorationApiServiceImpl";
import UserCreationApiServiceImpl from "./creation/UserCreationApiServiceImpl";
import UserSimpleResponseDto from "../../../rest/dto/user/UserSimpleResponseDto";
import {UserShortResponseDto} from "../../../rest/dto/user/UserShortResponseDto";

export default class UserApiServiceImpl implements UserApiService {
    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;

    constructor(protected readonly userExplorationApiService: UserExplorationApiService,
                protected readonly userCreationApiService: UserCreationApiService) {
    }

    public static getInstance (userExplorationApiService: UserExplorationApiService = UserExplorationApiServiceImpl.getInstance(),
                               userCreationApiService: UserCreationApiService = UserCreationApiServiceImpl.getInstance()): UserApiServiceImpl {
        return new UserApiServiceImpl(userExplorationApiService, userCreationApiService);
    }

    findSimpleById(id: number): Promise<UserSimpleResponseDto | null> {
        return this.userExplorationApiService.findSimpleById(id);
    }

    findShortById(id: number): Promise<UserShortResponseDto | null> {
        return this.userExplorationApiService.findShortById(id);
    }

    create(requestDto: UserRequestDto): Promise<UserResponseDto> {
        return this.userCreationApiService.create(requestDto);
    }

    findAll(index: number): Promise<PagedData<UserSimpleResponseDto>> {
        return this.userExplorationApiService.findAll(index);
    }

    findByEmail(email: string): Promise<UserResponseDto | null> {
        return this.userExplorationApiService.findByEmail(email);
    }

    findByFullName(fullName: FullNameExploration, i: number): Promise<PagedData<UserSimpleResponseDto>> {
        return this.userExplorationApiService.findByFullName(fullName, i);
    }

    findById(id: number): Promise<UserResponseDto | null> {
        return this.userExplorationApiService.findById(id);
    }

    remove(id: number): Promise<any> {
        const url = buildUrl(appConfig.serverMappings.users.root, id.toString())
        return this.apiInstance.delete(url);
    }

}