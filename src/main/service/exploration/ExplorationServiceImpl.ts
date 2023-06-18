import ExplorationService from "./ExplorationService";
import ExplorationStateManagerImpl from "./stateManager/ExplorationStateManagerImpl";
import store, {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import PersonExplorationApiServiceImpl from "./api/human/person/PersonExplorationApiServiceImpl";
import JurPersonExplorationApiServiceImpl from "./api/jurPerson/JurPersonExplorationApiServiceImpl";
import UserExplorationApiServiceImpl from "./api/human/user/UserExplorationApiServiceImpl";
import Person from "../../model/human/person/Person";
import PersonExplorationApiService from "./api/human/person/PersonExplorationApiService";
import {checkNotEmpty} from "../../util/pureFunctions";
import User from "../../model/human/user/User";
import UserExplorationApiService from "./api/human/user/UserExplorationApiService";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonExplorationApiService from "./api/jurPerson/JurPersonExplorationApiService";
import {
    BasicNotificationManager,
    NotificationManager
} from "../../redux/types/applicationState/Notification";
import PersonExplorationParams from "../../redux/types/exploration/human/person/PersonExplorationParams";
import ExplorationMode, {ExplorationModeName} from "../../redux/types/exploration/ExplorationMode";
import {Entity} from "../../model/Entity";
import PagedData, {UnPagedData} from "../../rest/PagedData";
import EntityExplorationState from "../../redux/types/exploration/EntityExplorationState";
import EntityExplorationParams from "../../redux/types/exploration/EntityExplorationParams";
import {AsyncThunkAction, createAsyncThunk} from "@reduxjs/toolkit";
import JurPersonExplorationParams from "../../redux/types/exploration/jurPerson/JurPersonExplorationParams";
import UserExplorationParams from "../../redux/types/exploration/human/user/UserExplorationParams";
import {ExplorationCoreAction, ExplorationTypedActions} from "../../redux/actions/ExplorationActions";
import EntityExplorationData from "../../redux/types/exploration/EntityExplorationData";
import deepCopy from "../../util/deepCopy";
import AuthenticationStateManager from "../auth/stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../auth/stateManager/AuthenticationStateManagerImpl";
import {BasicHttpError} from "../../error/BasicHttpError";
import ErrorResponse from "../../rest/ErrorResponse";
import ExplorationStateManager from "./stateManager/ExplorationStateManager";

class UnsupportedModeError extends Error {

    constructor(message: string = "Unsupported exploration mode") {
        super(message);
    }
}

class ExplorationServiceImpl implements ExplorationService {
    private readonly _store: typeof store;

    private readonly notificationManager: NotificationManager|null = null;

    private readonly shouldNotify: boolean;

    private readonly authStateManager: AuthenticationStateManager;

    private getAccessToken = (function (this: ExplorationServiceImpl) {
        return this.authStateManager.getAuth()!.accessToken;
    }).bind(this)

    constructor(providedStore: typeof store,shouldNotify: boolean = true, authStateManager?: AuthenticationStateManager) {
        this._store = providedStore;
        this.shouldNotify = shouldNotify;
        if (shouldNotify) {
            this.notificationManager = BasicNotificationManager.getManager(providedStore);
        }
        if (authStateManager) {
            this.authStateManager = authStateManager;
        } else {
            this.authStateManager = AuthenticationStateManagerImpl.getManager();
        }
    }

    private handleErr(e: unknown): ErrorResponse<unknown> {
        console.error(e);
        const error = BasicHttpError.parseError(e);
        return deepCopy(error);
    }


    private async explorePersons(explorationParams: UserExplorationParams, service: PersonExplorationApiService): Promise<PagedData<Person>> {
        const modeId = explorationParams.modeId;
        const mode: ExplorationMode = ExplorationMode.getModeById(modeId);
        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotEmpty(explorationParams.id);
                const content: Person[] = []
                const person = await service.findById(id);
                if (person) content.push(person);
                return new UnPagedData(content);
            }

            case ExplorationMode[ExplorationModeName.BY_FULL_NAME]: {
                const lastName = checkNotEmpty(explorationParams.lastName);
                const middleName = explorationParams.middleName;
                const firstName = explorationParams.firstName;
                return await service.findByFullName({lastName, middleName, firstName}) as PagedData<Person>;
            }

            default: {
                if (PersonExplorationParams.supportedModesIdList.includes(modeId)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();
            }
        }
    }


    private explorePersonsThunk = createAsyncThunk<EntityExplorationData<Person, PersonExplorationParams>,
        ThunkArg<{params: PersonExplorationParams, service: PersonExplorationApiService}>,
        LitmusAsyncThunkConfig>(ExplorationTypedActions.person[ExplorationCoreAction.RETRIEVE_DATA],async ({params,service}, {rejectWithValue, fulfillWithValue}) => {
            try {
                const response: PagedData<Person> = await this.explorePersons(params, service);
                const exploredData: EntityExplorationData<Person, PersonExplorationParams> = {requestParams: params, response: response}
                return fulfillWithValue(deepCopy(exploredData), {notify: this.shouldNotify});
            } catch (e: unknown) {
                return rejectWithValue(this.handleErr(e), {notify: true});
            }
    })

    private async exploreUsers(explorationParams: UserExplorationParams, service: UserExplorationApiService): Promise<PagedData<User>> {
        const modeId: number = explorationParams.modeId;
        const mode: ExplorationMode = ExplorationMode.getModeById(modeId);

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotEmpty(explorationParams.id);
                const content: User[] = [];
                const user = await service.findById(id);
                if (user) content.push(user);
                return new UnPagedData<User>(content);
            }

            case ExplorationMode[ExplorationModeName.BY_FULL_NAME]: {
                const lastName = checkNotEmpty(explorationParams.lastName);
                const middleName = explorationParams.middleName;
                const firstName = explorationParams.firstName
                return  await service.findByFullName({lastName, middleName, firstName})
            }

            default: {
                if (PersonExplorationParams.supportedModesIdList.includes(modeId)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();
            }
        }
    }

    private exploreUsersThunk = createAsyncThunk<EntityExplorationData<User, UserExplorationParams>,
        ThunkArg<{params: UserExplorationParams, service: UserExplorationApiService}>,
        LitmusAsyncThunkConfig>(ExplorationTypedActions.user[ExplorationCoreAction.RETRIEVE_DATA],(async ({params,service}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response: PagedData<User> = await this.exploreUsers(params, service);
            const exploredData: EntityExplorationData<User, UserExplorationParams> = {requestParams: params, response: response}
            return fulfillWithValue(deepCopy(exploredData), {notify: this.shouldNotify});
        } catch (e: unknown) {
            return rejectWithValue(this.handleErr(e), {notify: true});
        }
    }))


    private async exploreJurPersons(explorationParams: JurPersonExplorationParams, service: JurPersonExplorationApiService): Promise<PagedData<JurPerson>> {
        const modeId: number = explorationParams.modeId;
        const mode: ExplorationMode = ExplorationMode.getModeById(modeId);

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotEmpty(explorationParams.id);
                const content: JurPerson[] = [];
                const jurPerson = await service.findById(id);
                if (jurPerson) {
                    content.push(jurPerson)
                }
                return new UnPagedData(content);
            }

            default: {
                if (PersonExplorationParams.supportedModesIdList.includes(modeId)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();}
        }

    }

    private exploreJurPersonsThunk = createAsyncThunk<EntityExplorationData<JurPerson, JurPersonExplorationParams>,
        ThunkArg<{params: JurPersonExplorationParams, service: JurPersonExplorationApiService}>,
        LitmusAsyncThunkConfig>(ExplorationTypedActions.jurPerson[ExplorationCoreAction.RETRIEVE_DATA],(async ({params,service}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response: PagedData<JurPerson> = await this.exploreJurPersons(params, service);
            const exploredData: EntityExplorationData<JurPerson, JurPersonExplorationParams> = {requestParams: params, response: response}
            return fulfillWithValue(deepCopy(exploredData), {notify: this.shouldNotify});
        } catch (e: unknown) {
            return rejectWithValue(this.handleErr(e), {notify: true});
        }
    }))

    explore(entity: Entity): void {
        let stateManager: ExplorationStateManager<EntityExplorationState<unknown, EntityExplorationParams>>;

        let asyncThunk: AsyncThunkAction<EntityExplorationData<unknown, EntityExplorationParams>, unknown, LitmusAsyncThunkConfig>;

        switch (entity) {
            case Entity.PERSON: {
                const personManager = ExplorationStateManagerImpl.getPersonManager(this._store);
                stateManager = personManager;

                const service = new PersonExplorationApiServiceImpl(this.getAccessToken);

                asyncThunk = this.explorePersonsThunk({params: personManager.getExplorationParams(), service: service, globalPending: false})
                break;
            }
            case Entity.JUR_PERSON: {
                const jurPersonManager = ExplorationStateManagerImpl.getJurPersonManager(this._store);
                stateManager = jurPersonManager;

                const service = new JurPersonExplorationApiServiceImpl(this.getAccessToken);

                asyncThunk = this.exploreJurPersonsThunk({params: jurPersonManager.getExplorationParams(), service: service, globalPending: false})

                break;
            }
            case Entity.USER: {
                const userManager = ExplorationStateManagerImpl.getUserManager(this._store);
                stateManager = userManager;

                const service = new UserExplorationApiServiceImpl(this.getAccessToken);

                asyncThunk = this.exploreUsersThunk({params: userManager.getExplorationParams(), service: service, globalPending: false})

                break;
            }

            default: throw new Error("unsupported entity: " + entity);
        }

        stateManager.retrieveData(asyncThunk).catch(console.error);
    }

}

export default ExplorationServiceImpl;