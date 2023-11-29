import ApplicationResourcesService from "./ApplicationResourcesService";
import {createAsyncThunk} from "@reduxjs/toolkit";
import Role from "../../../model/userIdentity/Role";
import {LitmusAsyncThunkConfig, ThunkArg} from "../../../redux/store";
import {ApplicationResourcesAction} from "../../../redux/actions/ApplicationResourcesAction";
import ApplicationResourcesStateManager
    from "../../stateManagers/applicationResources/ApplicationResourcesStateManager";
import ApplicationResourcesApiService from "../../api/appResources/ApplicationResourcesApiService";
import RoleDtoMapper from "../../dtoMappers/user/RoleDtoMapper";
import ApplicationResourcesStateManagerImpl
    from "../../stateManagers/applicationResources/ApplicationResourcesStateManagerImpl";
import ApplicationResourcesApiServiceImpl from "../../api/appResources/ApplicationResourcesApiServiceImpl";
import RoleDtoMapperImpl from "../../dtoMappers/user/RoleDtoMapperImpl";
import serializableDeepCopy from "../../../util/functional/serializableDeepCopy";


export default class ApplicationResourcesServiceImpl implements ApplicationResourcesService {
    protected readonly stateManager: ApplicationResourcesStateManager;
    protected readonly apiService: ApplicationResourcesApiService;
    protected readonly roleMapper: RoleDtoMapper;

    public static getInstance(stateManager: ApplicationResourcesStateManager = ApplicationResourcesStateManagerImpl.getInstance(),
                              apiService: ApplicationResourcesApiService = ApplicationResourcesApiServiceImpl.getInstance(),
                              roleDtoMapper: RoleDtoMapper = RoleDtoMapperImpl.getInstance()): ApplicationResourcesServiceImpl {
        return new ApplicationResourcesServiceImpl(stateManager, apiService, roleDtoMapper);
    }

    constructor(stateManager: ApplicationResourcesStateManager, apiService: ApplicationResourcesApiService, roleDtoMapper: RoleDtoMapper) {
        this.stateManager = stateManager;
        this.apiService = apiService;
        this.roleMapper = roleDtoMapper;
    }

    protected readonly _retrieveRolesThunk =
        createAsyncThunk<Role[],ThunkArg, LitmusAsyncThunkConfig>(ApplicationResourcesAction.RETRIEVE_ROLES,
            async (meta, {rejectWithValue, fulfillWithValue})=>{
                try {
                    const rolesDtoList: Role[] = (await this.apiService.fetchRoles()).map(dto=>this.roleMapper.map(dto));
                    return fulfillWithValue(rolesDtoList, {notify: false})
                } catch (e) {
                    console.error(e);
                    return rejectWithValue(serializableDeepCopy(e), {notify: true})
                }
        });

    public async retrieveRoles (): Promise<Role[]> {
        return this.stateManager.retrieveRoles(this._retrieveRolesThunk({globalPending: true}))
    }
}