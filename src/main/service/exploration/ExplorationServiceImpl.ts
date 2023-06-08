import ExplorationService from "./ExplorationService";
import ExplorationStateManager from "../../redux/exploration/ExplorationStateManager";
import store from "../../redux/store";
import PersonServiceImpl from "../entityService/human/person/PersonServiceImpl";
import JurPersonServiceImpl from "../entityService/human/jurPerson/JurPersonServiceImpl";
import UserServiceImpl from "../entityService/user/UserServiceImpl";
import Person from "../../model/human/person/Person";
import PersonService from "../entityService/human/person/PersonService";
import {checkNotNull} from "../../util/pureFunctions";
import User from "../../model/human/user/User";
import UserService from "../entityService/user/UserService";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import JurPersonService from "../entityService/human/jurPerson/JurPersonService";
import {
    BasicNotification,
    BasicNotificationManager,
    NotificationManager,
    NotificationType, notificationTypes
} from "../../redux/applicationState/Notification";
import PersonExplorationState from "../../redux/exploration/person/PersonExplorationState";
import PersonExplorationParams from "../../redux/exploration/person/PersonExplorationParams";
import UserExplorationState from "../../redux/exploration/user/UserExplorationState";
import JurPersonExplorationState from "../../redux/exploration/jurPerson/JurPersonExplorationState";
import ExplorationMode, {ExplorationModeName} from "../../redux/exploration/ExplorationMode";
import {Entity} from "../../redux/exploration/Entity";

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

    private handleError (err: any) {
        let msg = 'unknown error'
        if (err instanceof Error) {
            msg = err.message;
        }
        this.conditionalOutput(notificationTypes.ERROR, msg);
        console.error(err);
    }
    
    private async explorePersons(stateManager: ExplorationStateManager<PersonExplorationState>, service: PersonService): Promise<Person[]> {
        const mode: ExplorationMode = stateManager.getExplorationParams().mode;

        let results: Person[] = [];

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotNull(stateManager.getExplorationState().params.id);
                const res = await service.findById(id);
                results = results.concat(res)
                break;
            }

            case ExplorationMode[ExplorationModeName.BY_FULL_NAME]: {
                const lastName = checkNotNull(stateManager.getExplorationState().params.lastName);
                const middleName = stateManager.getExplorationState().params.middleName;
                const firstName = stateManager.getExplorationState().params.firstName;
                const foundPersons = await service.findByFullName({lastName, middleName, firstName});
                results = results.concat(foundPersons);
                break;
            }

            default: {
                if (PersonExplorationParams.supportedModes.includes(mode)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();
            }
        }

        return results;
    }

    private async updatePersons(stateManager: ExplorationStateManager<PersonExplorationState>, service: PersonService) {
        try {
            stateManager.enablePending();
            // todo: pending notification (IDEA! write condition for time -1 or null for only hand delete)
            const persons: Person[] = await this.explorePersons(stateManager, service);
            stateManager.updateData({});
        } catch (e: any) {
            this.handleError(e);
        }
        finally {
            stateManager.disablePending();
        }
    }

    private async exploreUsers(stateManager: ExplorationStateManager<UserExplorationState>, service: UserService): Promise<User[]> {
        const mode: ExplorationMode = stateManager.getExplorationParams().mode;

        let results: User[] = [];

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_FULL_NAME]: {
                const lastName = checkNotNull(stateManager.getExplorationState().params.lastName);
                const middleName = stateManager.getExplorationState().params.middleName;
                const firstName = stateManager.getExplorationState().params.firstName
                const res = await service.findByFullName({lastName, middleName, firstName})
                results = results.concat(res);
                break;
            }

            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotNull(stateManager.getExplorationState().params.id);
                const res = await service.findById(id);
                results = results.concat(res)
                break;
            }

            default: {
                if (PersonExplorationParams.supportedModes.includes(mode)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();
            }
        }

        return results;
    }

    private async updateUsers (stateManager: ExplorationStateManager<UserExplorationState>, service: UserService) {
        try {
            stateManager.enablePending();
            // todo: pending notification (IDEA! write condition for time -1 or null for only hand delete)
            const users: User[] = await this.exploreUsers(stateManager, service);
            stateManager.updateDataResults(users);
        } catch (e: any) {
            this.handleError(e);
        }
        finally {
            stateManager.disablePending();
        }
    }


    private async exploreJurPersons(stateManager: ExplorationStateManager<JurPersonExplorationState>, service: JurPersonService) {
        const mode: ExplorationMode = stateManager.getExplorationParams().mode;

        let results: JurPerson[] = [];

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotNull(stateManager.getExplorationState().params.id);
                const res = await service.findById(id);
                results = results.concat(res);
                break;
            }

            default: {
                if (PersonExplorationParams.supportedModes.includes(mode)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();}
        }

        return results;
    }

    private async updateJurPersons (stateManager: ExplorationStateManager<JurPersonExplorationState>, service: JurPersonService) {
        try {
            stateManager.enablePending();
            // todo: pending notification (IDEA! write condition for time -1 or null for only hand delete)
            const jurPersons: JurPerson[] = await this.exploreJurPersons(stateManager, service);
            stateManager.updateDataResults(jurPersons);
        } catch (e: any) {
            this.handleError(e)
        }
        finally {
            stateManager.disablePending();
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

    explore(entity: Entity) {
        switch (entity) {
            case Entity.PERSON: {
                const stateManager: ExplorationStateManager<PersonExplorationState> = ExplorationStateManager.getPersonManager(this._store);
                const service = new PersonServiceImpl(this.getAccessToken);

                //@todo add some logic to err handing
                this.explorePersons(stateManager, service)
                    .catch(this.handleError);
                
                break;
            }
            case Entity.JUR_PERSON: {
                const stateManager = ExplorationStateManager.getJurPersonManager(this._store);
                const service = new JurPersonServiceImpl(this.getAccessToken);

                this.exploreJurPersons(stateManager, service)
                    .catch(this.handleError);

                break;
            }
            case Entity.USER: {
                const stateManager = ExplorationStateManager.getUserManager(this._store);
                const service = new UserServiceImpl(this.getAccessToken);

                this.exploreUsers(stateManager, service)
                    .catch(this.handleError);
            }
        }
    }
}