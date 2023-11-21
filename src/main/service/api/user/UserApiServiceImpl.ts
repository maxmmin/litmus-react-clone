import UserApiService from "./UserApiService";
import UserRequestDto from "../../../rest/dto/user/UserRequestDto";
import UserResponseDto from "../../../rest/dto/user/UserResponseDto";
import UserExplorationApiService from "../../exploration/api/human/user/UserExplorationApiService";
import UserCreationApiService from "../../creation/api/UserCreationApiService";
import {AxiosInstance} from "axios";
import AxiosApiManager from "../../rest/AxiosApiManager";
import PagedData from "../../../rest/PagedData";
import {FullNameExploration} from "../../../model/human/Human";
import {buildUrl} from "../../../util/pureFunctions";
import appConfig from "../../../config/appConfig";
import UserExplorationApiServiceImpl from "../../exploration/api/human/user/UserExplorationApiServiceImpl";
import UserCreationApiServiceImpl from "../../creation/api/UserCreationApiServiceImpl";

export default class UserApiServiceImpl implements UserApiService {
    protected readonly apiInstance: AxiosInstance = AxiosApiManager.globalApiInstance;

    constructor(protected readonly userExplorationApiService: UserExplorationApiService,
                protected readonly userCreationApiService: UserCreationApiService) {
    }

    public static getInstance (userExplorationApiService: UserExplorationApiService = UserExplorationApiServiceImpl.getInstance(),
                               userCreationApiService: UserCreationApiService = UserCreationApiServiceImpl.getInstance()): UserApiServiceImpl {
        return new UserApiServiceImpl(userExplorationApiService, userCreationApiService);
    }

    create(requestDto: UserRequestDto): Promise<UserResponseDto> {
        return this.userCreationApiService.create(requestDto);
    }

    findAll(index: number): Promise<PagedData<UserResponseDto>> {
        return this.userExplorationApiService.findAll(index);
    }

    findByEmail(email: string): Promise<UserResponseDto | null> {
        return this.userExplorationApiService.findByEmail(email);
    }

    findByFullName(fullName: FullNameExploration, i: number): Promise<PagedData<UserResponseDto>> {
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