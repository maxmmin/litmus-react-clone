import {AsyncThunkAction} from "@reduxjs/toolkit";
import store, {AppDispatch, LitmusAsyncThunkConfig} from "../../../redux/store";
import RoleDtoMapper from "../../dtoMappers/user/RoleDtoMapper";
import Role from "../../../model/userIdentity/Role";
import ApplicationResourcesStateManager from "./ApplicationResourcesStateManager";
import RoleDtoMapperImpl from "../../dtoMappers/user/RoleDtoMapperImpl";
import ApplicationResources, {RoleMap} from "../../../redux/types/applicationResources/ApplicationResources";
import CorsAnywhereProxyData from "../../api/nocorsproxy/CorsAnywhereProxyData";

export default class ApplicationResourcesStateManagerImpl implements ApplicationResourcesStateManager {
      protected readonly dtoMapper: RoleDtoMapper;
      protected readonly dispatch: AppDispatch = store.dispatch;
      protected readonly getState: ()=>ApplicationResources = () => store.getState().appResources!;

      constructor(dtoMapper: RoleDtoMapper) {
            this.dtoMapper = dtoMapper;
      }

      getAppResources(): ApplicationResources {
            return this.getState();
      }

      getRoles(): ApplicationResources["roles"] {
            return this.getAppResources().roles;
      }

      getCorsAnywhereProxiesData(): ApplicationResources["corsAnywhereProxies"] {
            return this.getAppResources().corsAnywhereProxies;
      }

      public static getInstance(dtoMapper: RoleDtoMapper = RoleDtoMapperImpl.getInstance()): ApplicationResourcesStateManagerImpl {
          return new ApplicationResourcesStateManagerImpl(dtoMapper);
      }

      public retrieveRoles (thunk: AsyncThunkAction<RoleMap, unknown, LitmusAsyncThunkConfig>): Promise<RoleMap> {
          return this.dispatch(thunk).unwrap()
      }

      public retrieveCorsAnywhereProxiesData(thunk: AsyncThunkAction<CorsAnywhereProxyData[], unknown, LitmusAsyncThunkConfig>): Promise<CorsAnywhereProxyData[]> {
            return this.dispatch(thunk).unwrap();
      }

      public retrieveAppResources (thunk: AsyncThunkAction<ApplicationResources, unknown, LitmusAsyncThunkConfig>): Promise<ApplicationResources> {
            return this.dispatch(thunk).unwrap()
      }

}