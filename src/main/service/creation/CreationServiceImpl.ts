import store, {AppDispatch, LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import CreationService from "./CreationService";
import {Entity} from "../../model/Entity";
import CreationCoreAction from "../../redux/actions/CreationCoreAction";
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
import EntityCreationState from "../../redux/types/creation/EntityCreationState";
import CreationTypedActions from "../../redux/actions/CreationTypedActions";
import ErrorResponse from "../../rest/ErrorResponse";
import {BasicHttpError} from "../../error/BasicHttpError";
import CreationStateManager from "./stateManager/CreationStateManager";
import CreationDtoMapper from "./mapper/CreationDtoMapper";
import JurPersonCreationDtoMapper from "./mapper/JurPersonCreationDtoMapper";
import JurPersonCreationApiDto from "./mapper/dto/JurPersonCreationApiDto";
import UserCreationApiDto from "./mapper/dto/UserCreationApiDto";
import PersonCreationApiDto from "./mapper/dto/PersonCreationApiDto";
import PersonCreationDtoMapper from "./mapper/PersonCreationDtoMapper";
import UserCreationDtoMapper from "./mapper/UserCreationDtoMapper";

type CreationStore = ReturnType<typeof store.getState>["creation"]

type Mappers = {
    user: CreationDtoMapper<User, UserCreationApiDto>,
    person: CreationDtoMapper<Person, PersonCreationApiDto>,
    jurPerson: CreationDtoMapper<JurPerson, JurPersonCreationApiDto>
}

class CreationServiceImpl implements CreationService {
    private readonly getState: ()=>CreationStore;
    private readonly dispatch: AppDispatch;
    private readonly mappers: Mappers;
    private readonly authStateManager: AuthenticationStateManager;

    private handleErr (e: unknown): ErrorResponse<unknown> {
        console.error(e);
        const error = BasicHttpError.parseError(e);
        return deepCopy(error);
    }

    private getAccessToken = (function (this: CreationServiceImpl) {
        return this.authStateManager.getAuth()!.accessToken;
    }).bind(this)

    private async createPerson (person: Person, service: PersonCreationApiService): Promise<Person> {
        const personCreationDto: PersonCreationApiDto = this.mappers.person.creationParamsToCreationDto(person);
        return await service.create(personCreationDto);
    }

    private createPersonThunk = createAsyncThunk<Person,
        ThunkArg<{emergingPerson: Person, service: PersonCreationApiService}>,
        LitmusAsyncThunkConfig>(CreationTypedActions.person[CreationCoreAction.CREATE_ENTITY],async ({emergingPerson,service}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const person: Person = await this.createPerson(emergingPerson, service);
            // @todo write link
            return fulfillWithValue(deepCopy(person), {notify: true});
        } catch (e: unknown) {
            return rejectWithValue(this.handleErr(e), {notify: true});
        }
    })

    private async createUser (user: User, service: UserCreationApiService): Promise<User> {
        const userCreationDto: UserCreationApiDto = this.mappers.user.creationParamsToCreationDto(user);
        return await service.create(userCreationDto);
    }

    private createUserThunk = createAsyncThunk<User,
        ThunkArg<{emergingUser: User, service: UserCreationApiService}>,
        LitmusAsyncThunkConfig>(CreationTypedActions.user[CreationCoreAction.CREATE_ENTITY],async ({emergingUser,service}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const user: User = await this.createUser(emergingUser, service);
            // @todo write link
            return fulfillWithValue(deepCopy(user), {notify: true});
        } catch (e: unknown) {
            return rejectWithValue(this.handleErr(e), {notify: true});
        }
    })

    private async createJurPerson (params: JurPerson, service: JurPersonCreationApiService): Promise<JurPerson> {
        const dto: JurPersonCreationApiDto = this.mappers.jurPerson.creationParamsToCreationDto(params);
        return await service.create(dto);
    }

    private createJurPersonThunk = createAsyncThunk<JurPerson,
        ThunkArg<{params: JurPerson, service: JurPersonCreationApiService}>,
        LitmusAsyncThunkConfig>(CreationTypedActions.jurPerson[CreationCoreAction.CREATE_ENTITY],async ({params,service}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const jurPerson: JurPerson = await this.createJurPerson(params, service);
            // @todo write link
            return fulfillWithValue(deepCopy(jurPerson), {notify: true});
        } catch (e: unknown) {
            return rejectWithValue(this.handleErr(e), {notify: true});
        }
    })

    constructor(dispatch: AppDispatch, getState: ()=>CreationStore, authStateManager: AuthenticationStateManager, mappers: Mappers) {
      this.dispatch = dispatch;
      this.getState = getState;
      this.authStateManager = authStateManager;
      this.mappers = mappers;
    }

    static getInstance(_store: typeof store, authStateManager?: AuthenticationStateManager, mappers?: Mappers) {
        if (!authStateManager) {
            authStateManager = AuthenticationStateManagerImpl.getManager(_store);
        }
        if (!mappers) {
            mappers = {
                jurPerson: new JurPersonCreationDtoMapper(),
                person: new PersonCreationDtoMapper(),
                user: new UserCreationDtoMapper()
            };
        }
        return new CreationServiceImpl(_store.dispatch, ()=>_store.getState().creation,authStateManager, mappers)
    }

    create(entity: Entity): void {

        let stateManager: CreationStateManager<EntityCreationState<unknown>>;

        let asyncThunk: AsyncThunkAction<unknown, unknown, LitmusAsyncThunkConfig>;

        switch (entity) {
            case Entity.PERSON: {
                const personManager = CreationStateManagerFactory.getPersonManager(store);
                stateManager = personManager;

                const service = new PersonCreationApiService(this.getAccessToken);

                asyncThunk = this.createPersonThunk({emergingPerson: personManager.getCreationParams(), service: service, globalPending: false})
                break;
            }
            case Entity.JUR_PERSON: {
                const jurPersonManager = CreationStateManagerFactory.getJurPersonManager(store);
                stateManager = jurPersonManager;

                const service = new JurPersonCreationApiService(this.getAccessToken);

                asyncThunk = this.createJurPersonThunk({params: jurPersonManager.getCreationParams(), service: service, globalPending: false})

                break;
            }
            case Entity.USER: {
                const userManager = CreationStateManagerFactory.getUserManager(store);
                stateManager = userManager;

                const service = new UserCreationApiService(this.getAccessToken);

                asyncThunk = this.createUserThunk({emergingUser: userManager.getCreationParams(), service: service, globalPending: false})

                break;
            }

            default: throw new Error("unsupported entity: " + entity);
        }

        stateManager.create(asyncThunk).catch(console.error)
    }
}

export default CreationServiceImpl;