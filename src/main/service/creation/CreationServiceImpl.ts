import store, {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
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
import ExplorationStateManagerImpl from "../exploration/stateManager/ExplorationStateManagerImpl";
import JurPersonExplorationApiServiceImpl from "../exploration/api/jurPerson/JurPersonExplorationApiServiceImpl";
import UserExplorationApiServiceImpl from "../exploration/api/human/user/UserExplorationApiServiceImpl";
import CreationStateManagerFactory from "./stateManager/CreationStateManagerFactory";
import {AsyncThunkAction, createAsyncThunk} from "@reduxjs/toolkit";
import EntityExplorationData from "../../redux/exploration/types/EntityExplorationData";
import PersonExplorationParams from "../../redux/exploration/types/human/person/PersonExplorationParams";
import PersonExplorationApiService from "../exploration/api/human/person/PersonExplorationApiService";
import {ExplorationCoreAction, ExplorationTypedActions} from "../../redux/exploration/ExplorationActions";
import PagedData from "../../util/apiRequest/PagedData";
import deepCopy from "../../util/deepCopy";
import EntityCreationState from "../../redux/creation/EntityCreationState";
import CreationTypedActions from "../../redux/creation/CreationTypedActions";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import EntityExplorationState from "../../redux/exploration/types/EntityExplorationState";
import EntityExplorationParams from "../../redux/exploration/types/EntityExplorationParams";

class CreationServiceImpl implements CreationService {
    private readonly _store: typeof store;
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

    private createJurPersonTHunk = createAsyncThunk<JurPerson,
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

    constructor(authStateManager: AuthenticationStateManager = new AuthenticationStateManagerImpl(), _store: typeof store) {
        this._store = _store;
        this.authStateManager = authStateManager;
    }

    async create(entity: Entity): Promise<void> {

        let stateManager: ExplorationStateManagerImpl<EntityExplorationState<any, EntityExplorationParams>>;

        let asyncThunk: AsyncThunkAction<EntityExplorationData<any, any>, any, any>;

        switch (entity) {
            case Entity.PERSON: {
                const personManager = CreationStateManagerFactory.getPersonManager(this._store);

                const service = new PersonCreationApiService(this.getAccessToken);

                asyncThunk = this.explorePersonsThunk({params: personManager.getExplorationParams(), service: service, globalPending: false})
                break;
            }
            case Entity.JUR_PERSON: {
                const jurPersonManager = ExplorationStateManagerImpl.getJurPersonManager(this._store);
                stateManager = jurPersonManager;

                const service = new JurPersonExplorationApiServiceImpl(this.getAccessToken.bind(this));

                asyncThunk = this.exploreJurPersonsThunk({params: jurPersonManager.getExplorationParams(), service: service, globalPending: false})

                break;
            }
            case Entity.USER: {
                const userManager = ExplorationStateManagerImpl.getUserManager(this._store);
                stateManager = userManager;

                const service = new UserExplorationApiServiceImpl(this.getAccessToken.bind(this));

                asyncThunk = this.exploreUsersThunk({params: userManager.getExplorationParams(), service: service, globalPending: false})

                break;
            }
    }

}}