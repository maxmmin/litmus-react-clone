import ExplorationService from "./ExplorationService";
import ExplorationStateManager from "./ExplorationStateManager";
import store, {LitmusAsyncThunkConfig, ThunkArg} from "../../redux/store";
import PersonLookupServiceImpl from "./lookup/human/person/PersonLookupServiceImpl";
import JurPersonLookupServiceImpl from "./lookup/jurPerson/JurPersonLookupServiceImpl";
import UserLookupServiceImpl from "./lookup/human/user/UserLookupServiceImpl";
import Person from "../../model/human/person/Person";
import PersonLookupService from "./lookup/human/person/PersonLookupService";
import deepCopy, {checkNotEmpty} from "../../util/pureFunctions";
import User from "../../model/human/user/User";
import UserLookupService from "./lookup/human/user/UserLookupService";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonLookupService from "./lookup/jurPerson/JurPersonLookupService";
import {
    AppNotificationType,
    BasicNotification,
    BasicNotificationManager,
    NotificationManager
} from "../../redux/applicationState/Notification";
import PersonExplorationParams from "../../redux/exploration/types/human/person/PersonExplorationParams";
import ExplorationMode, {ExplorationModeName} from "../../redux/exploration/types/ExplorationMode";
import {Entity} from "../../model/Entity";
import PagedData, {UnPagedData} from "../../util/apiRequest/PagedData";
import EntityExplorationState from "../../redux/exploration/types/EntityExplorationState";
import EntityExplorationParams from "../../redux/exploration/types/EntityExplorationParams";
import {AsyncThunkAction, createAsyncThunk} from "@reduxjs/toolkit";
import JurPersonExplorationParams from "../../redux/exploration/types/jurPerson/JurPersonExplorationParams";
import UserExplorationParams from "../../redux/exploration/types/human/user/UserExplorationParams";
import {ExplorationCoreAction, ExplorationTypedActions} from "../../redux/exploration/ExplorationActions";
import EntityExplorationData from "../../redux/exploration/types/EntityExplorationData";

class UnsupportedModeError extends Error {

    constructor(message: string = "Unsupported exploration mode") {
        super(message);
    }
}

class ExplorationServiceImpl implements ExplorationService {
    private readonly _store: typeof store;

    private readonly notificationManager: NotificationManager|null = null;

    private readonly shouldNotify: boolean;

    constructor(providedStore: typeof store, shouldNotify: boolean = true) {
        this._store = providedStore;
        this.shouldNotify = shouldNotify;
        if (shouldNotify) {
            this.notificationManager = new BasicNotificationManager();
        }
    }

    private async explorePersons(explorationParams: UserExplorationParams, service: PersonLookupService): Promise<PagedData<Person>> {
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
        ThunkArg<{params: PersonExplorationParams, service: PersonLookupService}>,
        LitmusAsyncThunkConfig>(ExplorationTypedActions.person[ExplorationCoreAction.RETRIEVE_DATA],async ({params,service}, {rejectWithValue, fulfillWithValue}) => {
            try {
                const response: PagedData<Person> = await this.explorePersons(params, service);
                const exploredData: EntityExplorationData<Person, PersonExplorationParams> = {requestParams: params, response: response}
                return fulfillWithValue(deepCopy(exploredData), {notify: this.shouldNotify});
            } catch (e: any) {
                return rejectWithValue(deepCopy(e));
            }
    })

    private async exploreUsers(explorationParams: UserExplorationParams, service: UserLookupService): Promise<PagedData<User>> {
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
        ThunkArg<{params: UserExplorationParams, service: UserLookupService}>,
        LitmusAsyncThunkConfig>(ExplorationTypedActions.user[ExplorationCoreAction.RETRIEVE_DATA],(async ({params,service}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response: PagedData<User> = await this.exploreUsers(params, service);
            const exploredData: EntityExplorationData<User, UserExplorationParams> = {requestParams: params, response: response}
            return fulfillWithValue(deepCopy(exploredData), {notify: this.shouldNotify});
        } catch (e: any) {
            return rejectWithValue(deepCopy(e));
        }
    }))


    private async exploreJurPersons(explorationParams: JurPersonExplorationParams, service: JurPersonLookupService): Promise<PagedData<JurPerson>> {
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
        ThunkArg<{params: JurPersonExplorationParams, service: JurPersonLookupService}>,
        LitmusAsyncThunkConfig>(ExplorationTypedActions.jurPerson[ExplorationCoreAction.RETRIEVE_DATA],(async ({params,service}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const response: PagedData<JurPerson> = await this.exploreJurPersons(params, service);
            const exploredData: EntityExplorationData<JurPerson, JurPersonExplorationParams> = {requestParams: params, response: response}
            return fulfillWithValue(deepCopy(exploredData), {notify: this.shouldNotify});
        } catch (e: any) {
            return rejectWithValue(deepCopy(e));
        }
    }))

    private getAccessToken (): string {
        const token = this._store.getState().authentication?.accessToken;
        if (token) {
            //@todo: rewrite it with isvalid
            return token;
        } else {
            throw new Error("null token")
        }
    }

    async explore(entity: Entity): Promise<void> {
        let stateManager: ExplorationStateManager<EntityExplorationState<any, EntityExplorationParams>>;

        let asyncThunk: AsyncThunkAction<EntityExplorationData<any, any>, any, any>;


        switch (entity) {
            case Entity.PERSON: {
                const personManager = ExplorationStateManager.getPersonManager(this._store);
                stateManager = personManager;

                const service = new PersonLookupServiceImpl(this.getAccessToken.bind(this));

                asyncThunk = this.explorePersonsThunk({params: personManager.getExplorationParams(), service: service, globalPending: false})
                break;
            }
            case Entity.JUR_PERSON: {
                const jurPersonManager = ExplorationStateManager.getJurPersonManager(this._store);
                stateManager = jurPersonManager;

                const service = new JurPersonLookupServiceImpl(this.getAccessToken.bind(this));

                asyncThunk = this.exploreJurPersonsThunk({params: jurPersonManager.getExplorationParams(), service: service, globalPending: false})

                break;
            }
            case Entity.USER: {
                const userManager = ExplorationStateManager.getUserManager(this._store);
                stateManager = userManager;

                const service = new UserLookupServiceImpl(this.getAccessToken.bind(this));

                asyncThunk = this.exploreUsersThunk({params: userManager.getExplorationParams(), service: service, globalPending: false})

                break;
            }

            default: throw new Error("unsupported entity: " + entity);
        }

        stateManager.retrieveData(asyncThunk);
    }

}

export default ExplorationServiceImpl;