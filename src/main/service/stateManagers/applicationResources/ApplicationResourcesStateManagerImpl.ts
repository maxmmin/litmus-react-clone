import {AsyncThunkAction} from "@reduxjs/toolkit";
import store, {AppDispatch, LitmusAsyncThunkConfig} from "../../../redux/store";
import RoleDtoMapper from "../../dtoMappers/user/RoleDtoMapper";
import Role from "../../../model/userIdentity/Role";
import ApplicationResourcesStateManager from "./ApplicationResourcesStateManager";
import RoleDtoMapperImpl from "../../dtoMappers/user/RoleDtoMapperImpl";
import ApplicationResources from "../../../redux/types/applicationResources/ApplicationResources";

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


      public static getInstance(dtoMapper: RoleDtoMapper = RoleDtoMapperImpl.getInstance()): ApplicationResourcesStateManagerImpl {
          return new ApplicationResourcesStateManagerImpl(dtoMapper);
      }

      public retrieveRoles (thunk: AsyncThunkAction<Role[], unknown, LitmusAsyncThunkConfig>): Promise<Role[]> {
          return this.dispatch(thunk).unwrap()
      }
}