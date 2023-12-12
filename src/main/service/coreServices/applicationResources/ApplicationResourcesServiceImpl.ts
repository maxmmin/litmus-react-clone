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
import CorsAnywhereProxyData from "../../api/nocorsproxy/CorsAnywhereProxyData";
import ApplicationResources, {RoleMap} from "../../../redux/types/applicationResources/ApplicationResources";
import ApplicationResourcesResponseDto from "../../../rest/dto/ApplicationResourcesResponseDto";
import buildRoleMap from "../../../util/functional/buildRoleMap";


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
        createAsyncThunk<RoleMap,ThunkArg, LitmusAsyncThunkConfig>(ApplicationResourcesAction.RETRIEVE_ROLES,
            async (meta, {rejectWithValue, fulfillWithValue})=>{
                try {
                    const roles: Role[] = (await this.apiService.fetchRoles()).map(dto=>this.roleMapper.map(dto));
                    return fulfillWithValue(buildRoleMap(roles), {notify: false})
                } catch (e) {
                    console.error(e);
                    return rejectWithValue(serializableDeepCopy(e), {notify: true})
                }
        });

    public async loadRoles (): Promise<RoleMap> {
        return this.stateManager.retrieveRoles(this._retrieveRolesThunk({globalPending: true}))
    }

    protected readonly _retrieveCorsAnywhereProxiesListThunk =
        createAsyncThunk<CorsAnywhereProxyData[],ThunkArg, LitmusAsyncThunkConfig>(ApplicationResourcesAction.RETRIEVE_CORS_ANYWHERE_PROXIES,
            async (meta, {rejectWithValue, fulfillWithValue})=>{
                try {
                    const corsAnywhereProxyData: CorsAnywhereProxyData[] = await this.apiService.fetchCorsAnywhereProxiesList();
                    return fulfillWithValue(corsAnywhereProxyData, {notify: false})
                } catch (e) {
                    console.error(e);
                    return rejectWithValue(serializableDeepCopy(e), {notify: true})
                }
            });

    loadCorsAnywhereProxiesList(): Promise<CorsAnywhereProxyData[]> {
        return this.stateManager.retrieveCorsAnywhereProxiesData(this._retrieveCorsAnywhereProxiesListThunk({globalPending: true}))
    }

    protected readonly _retrieveAppResources =
        createAsyncThunk<ApplicationResources,ThunkArg, LitmusAsyncThunkConfig>(ApplicationResourcesAction.RETRIEVE_CONTEXT,
            async (meta, {rejectWithValue, fulfillWithValue})=>{
                try {
                    const resourcesResponseDto: ApplicationResourcesResponseDto = await this.apiService.fetchAppResources();
                    const resources: ApplicationResources = {
                        ...resourcesResponseDto,
                        roles: buildRoleMap(resourcesResponseDto.roles.map(r => this.roleMapper.map(r)))
                    }
                    return fulfillWithValue(resources, {notify: false})
                } catch (e) {
                    console.error(e);
                    return rejectWithValue(serializableDeepCopy(e), {notify: true})
                }
            });

    loadAll(): Promise<ApplicationResources> {
        return this.stateManager.retrieveAppResources(this._retrieveAppResources({globalPending: true}))
    }


}