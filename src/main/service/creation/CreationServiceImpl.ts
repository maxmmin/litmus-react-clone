import store, {AppDispatch, LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import CreationService from "./CreationService";
import {Entity} from "../../model/Entity";
import CreationCoreActions, {
    JurPersonCreationParams,
    PersonCreationParams,
    UserCreationParams
} from "../../redux/creation/CreationCoreActions";
import PersonCreationApiService from "./api/PersonCreationApiService";
import Person from "../../model/human/person/Person";
import UserCreationApiService from "./api/UserCreationApiService";
import User from "../../model/human/user/User";
import JurPersonCreationApiService from "./api/JurPersonCreationApiService";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import AuthenticationStateManagerImpl from "../auth/stateManager/AuthenticationStateManagerImpl";
import AuthenticationStateManager from "../auth/stateManager/AuthenticationStateManager";
import CreationStateManagerFactory from "./stateManager/CreationStateManagerFactory";
import {AsyncThunkAction, createAsyncThunk} from "@reduxjs/toolkit";
import deepCopy from "../../util/deepCopy";
import EntityCreationState from "../../redux/creation/EntityCreationState";
import CreationTypedActions from "../../redux/creation/CreationTypedActions";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import CreationStateManager from "./stateManager/CreationStateManager";

type CreationStore = ReturnType<typeof store.getState>["creation"]

class CreationServiceImpl implements CreationService {
    private readonly getState: ()=>CreationStore;
    private readonly dispatch: AppDispatch;


    private readonly authStateManager: AuthenticationStateManager;

    private handleErr (e: unknown): ErrorResponse<unknown> {
        console.error(e);
        const error = BasicHttpError.parseError(e);
        return deepCopy(error);
    }

    private getAccessToken () {
        return this.authStateManager.getAuth()!.accessToken;
    }

    private async createPerson (params: PersonCreationParams, service: PersonCreationApiService): Promise<Person> {
        return await service.create(params);
    }

    private createPersonThunk = createAsyncThunk<Person,
        ThunkArg<{params: PersonCreationParams, service: PersonCreationApiService}>,
        LitmusAsyncThunkConfig>(CreationTypedActions.person[CreationCoreActions.CREATE_ENTITY],async ({params,service}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const person: Person = await this.createPerson(params, service);
            // @todo write link
            return fulfillWithValue(deepCopy(person), {notify: true});
        } catch (e: unknown) {
            return rejectWithValue(this.handleErr(e), {notify: true});
        }
    })

    private async createUser (params: UserCreationParams, service: UserCreationApiService): Promise<User> {
        return await service.create(params);
    }

    private createUserThunk = createAsyncThunk<User,
        ThunkArg<{params: UserCreationParams, service: UserCreationApiService}>,
        LitmusAsyncThunkConfig>(CreationTypedActions.user[CreationCoreActions.CREATE_ENTITY],async ({params,service}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const user: User = await this.createUser(params, service);
            // @todo write link
            return fulfillWithValue(deepCopy(user), {notify: true});
        } catch (e: unknown) {
            return rejectWithValue(this.handleErr(e), {notify: true});
        }
    })

    private async createJurPerson (params: JurPersonCreationParams, service: JurPersonCreationApiService): Promise<JurPerson> {
        return await service.create(params);
    }

    private createJurPersonThunk = createAsyncThunk<JurPerson,
        ThunkArg<{params: JurPersonCreationParams, service: JurPersonCreationApiService}>,
        LitmusAsyncThunkConfig>(CreationTypedActions.jurPerson[CreationCoreActions.CREATE_ENTITY],async ({params,service}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const jurPerson: JurPerson = await this.createJurPerson(params, service);
            // @todo write link
            return fulfillWithValue(deepCopy(jurPerson), {notify: true});
        } catch (e: unknown) {
            return rejectWithValue(this.handleErr(e), {notify: true});
        }
    })

    constructor(dispatch: AppDispatch, getState: ()=>CreationStore, authStateManager: AuthenticationStateManager) {
      this.dispatch = dispatch;
      this.getState = getState;
      this.authStateManager = authStateManager;
    }

    create(entity: Entity): void {

        let stateManager: CreationStateManager<EntityCreationState<unknown>>;

        let asyncThunk: AsyncThunkAction<unknown, unknown, LitmusAsyncThunkConfig>;

        switch (entity) {
            case Entity.PERSON: {
                const personManager = CreationStateManagerFactory.getPersonManager();
                stateManager = personManager;

                const service = new PersonCreationApiService(this.getAccessToken);

                asyncThunk = this.createPersonThunk({params: personManager.getCreationParams(), service: service, globalPending: false})
                break;
            }
            case Entity.JUR_PERSON: {
                const jurPersonManager = CreationStateManagerFactory.getJurPersonManager();
                stateManager = jurPersonManager;

                const service = new JurPersonCreationApiService(this.getAccessToken.bind(this));

                asyncThunk = this.createJurPersonThunk({params: jurPersonManager.getCreationParams(), service: service, globalPending: false})

                break;
            }
            case Entity.USER: {
                const userManager = CreationStateManagerFactory.getUserManager();
                stateManager = userManager;

                const service = new UserCreationApiService(this.getAccessToken.bind(this));

                asyncThunk = this.createUserThunk({params: userManager.getCreationParams(), service: service, globalPending: false})

                break;
            }

            default: throw new Error("unsupported entity: " + entity);
        }

        stateManager.create(asyncThunk).catch(console.error)
    }
}

export default CreationServiceImpl;