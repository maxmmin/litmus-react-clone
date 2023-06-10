import ExplorationService from "./ExplorationService";
import ExplorationStateManager from "./ExplorationStateManager";
import store from "../../redux/store";
import PersonLookupServiceImpl from "./lookup/human/person/PersonLookupServiceImpl";
import JurPersonLookupServiceImpl from "./lookup/jurPerson/JurPersonLookupServiceImpl";
import UserLookupServiceImpl from "./lookup/human/user/UserLookupServiceImpl";
import Person from "../../model/human/person/Person";
import PersonLookupService from "./lookup/human/person/PersonLookupService";
import {checkNotNull} from "../../util/pureFunctions";
import User from "../../model/human/user/User";
import UserLookupService from "./lookup/human/user/UserLookupService";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonLookupService from "./lookup/jurPerson/JurPersonLookupService";
import {
    BasicNotification,
    BasicNotificationManager,
    NotificationManager,
    NotificationType, notificationTypes
} from "../../redux/applicationState/Notification";
import PersonExplorationState from "../../redux/exploration/types/human/person/PersonExplorationState";
import PersonExplorationParams from "../../redux/exploration/types/human/person/PersonExplorationParams";
import UserExplorationState from "../../redux/exploration/types/human/user/UserExplorationState";
import JurPersonExplorationState from "../../redux/exploration/types/jurPerson/JurPersonExplorationState";
import ExplorationMode, {ExplorationModeName} from "../../redux/exploration/types/ExplorationMode";
import {Entity} from "../../model/Entity";
import PagedData, {UnPagedData} from "../../util/apiRequest/PagedData";
import EntityExplorationState from "../../redux/exploration/types/EntityExplorationState";
import EntityExplorationParams from "../../redux/exploration/types/EntityExplorationParams";
import {BasicHttpError} from "../../util/apiRequest/BasicHttpError";
import ErrorResponse from "../../util/apiRequest/ErrorResponse";

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
            this.notificationManager = new BasicNotificationManager(providedStore.dispatch);
        }
    }

    private conditionalOutput(type: NotificationType,message: string) {
        if (this.shouldNotify) {
            this.notificationManager!.addNotification(new BasicNotification(type, message));
        }
    }

    private handleError (err: any): null {
        let msg = 'unknown error'
        if (err instanceof Error) {
            msg = err.message;
        } else if ("status" in err && "detail" in err) {
            const basicHttpError = err as ErrorResponse<any>;
            msg = `Error ${basicHttpError.status}: ${basicHttpError.title}`
        }
        this.conditionalOutput(notificationTypes.ERROR, msg);
        console.error(err);
        return null;
    }
    
    private async explorePersons(stateManager: ExplorationStateManager<PersonExplorationState>, service: PersonLookupService): Promise<PagedData<Person>> {
        const modeId = stateManager.getExplorationParams().modeId;
        const mode: ExplorationMode = ExplorationMode.getModeById(modeId);
        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotNull(stateManager.getExplorationState().params.id);
                const content: Person[] = []
                const person = await service.findById(id);
                if (person) content.push(person);
                return new UnPagedData(content);
            }

            case ExplorationMode[ExplorationModeName.BY_FULL_NAME]: {
                const lastName = checkNotNull(stateManager.getExplorationState().params.lastName);
                const middleName = stateManager.getExplorationState().params.middleName;
                const firstName = stateManager.getExplorationState().params.firstName;
                return await service.findByFullName({lastName, middleName, firstName}) as PagedData<Person>;
            }

            default: {
                if (PersonExplorationParams.supportedModesIdList.includes(modeId)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();
            }
        }
    }


    private async exploreUsers(stateManager: ExplorationStateManager<UserExplorationState>, service: UserLookupService): Promise<PagedData<User>> {
        const modeId: number = stateManager.getExplorationParams().modeId;
        const mode: ExplorationMode = ExplorationMode.getModeById(modeId);

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotNull(stateManager.getExplorationState().params.id);
                const content: User[] = [];
                const user = await service.findById(id);
                if (user) content.push(user);
                return new UnPagedData<User>(content);
            }

            case ExplorationMode[ExplorationModeName.BY_FULL_NAME]: {
                const lastName = checkNotNull(stateManager.getExplorationState().params.lastName);
                const middleName = stateManager.getExplorationState().params.middleName;
                const firstName = stateManager.getExplorationState().params.firstName
                return  await service.findByFullName({lastName, middleName, firstName})
            }

            default: {
                if (PersonExplorationParams.supportedModesIdList.includes(modeId)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();
            }
        }
    }


    private async exploreJurPersons(stateManager: ExplorationStateManager<JurPersonExplorationState>, service: JurPersonLookupService): Promise<PagedData<JurPerson>> {
        const modeId: number = stateManager.getExplorationParams().modeId;
        const mode: ExplorationMode = ExplorationMode.getModeById(modeId);

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotNull(stateManager.getExplorationState().params.id);
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
        let getData: ()=>Promise<PagedData<any>>;

        switch (entity) {
            case Entity.PERSON: {
                const personManager = ExplorationStateManager.getPersonManager(this._store);
                stateManager = personManager;

                const service = new PersonLookupServiceImpl(this.getAccessToken.bind(this));

                getData = ()=>this.explorePersons(personManager, service)
                
                break;
            }
            case Entity.JUR_PERSON: {
                const jurPersonManager = ExplorationStateManager.getJurPersonManager(this._store);
                stateManager = jurPersonManager;
                const service = new JurPersonLookupServiceImpl(this.getAccessToken.bind(this));

                getData = ()=>this.exploreJurPersons(jurPersonManager, service)

                break;
            }
            case Entity.USER: {
                const userManager = ExplorationStateManager.getUserManager(this._store);
                stateManager = userManager;
                const service = new UserLookupServiceImpl(this.getAccessToken.bind(this));

                getData = ()=>this.exploreUsers(userManager, service);

                break;
            }

            default: throw new Error("unsupported entity: " + entity);
        }

        stateManager = stateManager!;
        stateManager.enablePending();

        const requestParams = stateManager.getExplorationState().params;

        const response = await getData().catch(this.handleError.bind(this));
        if (response) {
            stateManager.updateData({response: response, requestParams: requestParams});
        } else {
            stateManager.updateData(null);
        }
        stateManager.disablePending();
    }
}

export default ExplorationServiceImpl;