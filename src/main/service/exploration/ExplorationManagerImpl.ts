import ExplorationManager from "./ExplorationManager";
import {
    Entity,
    EntityExplorationParams,
    ExplorationMode,
    ExplorationModeName
} from "../../redux/exploration/EntityExplorationState";
import ExplorationStateManager from "../../redux/exploration/ExplorationStateManager";
import store from "../../redux/store";
import PersonExplorationServiceImpl from "./person/PersonExplorationServiceImpl";
import JurPersonExplorationServiceImpl from "./jurPerson/JurPersonExplorationServiceImpl";
import UserExplorationServiceImpl from "./user/UserExplorationServiceImpl";
import Person from "../../model/person/Person";
import {PersonExplorationParams} from "../../redux/exploration/person/PersonExploration";
import PersonExplorationService from "./person/PersonExplorationService";
import {checkNotNull} from "../../util/pureFunctions";
import User from "../../model/user/User";
import {UserExplorationParams, UserExplorationState} from "../../redux/exploration/user/UserExploration";
import UserExplorationService from "./user/UserExplorationService";
import {JurPerson} from "../../model/jurPerson/JurPerson";
import {JurPersonExplorationParams} from "../../redux/exploration/jurPerson/JurPersonExploration";
import JurPersonExplorationService from "./jurPerson/JurPersonExplorationService";
import Notification, {
    BasicNotification,
    BasicNotificationManager,
    NotificationManager,
    NotificationType, notificationTypes
} from "../../redux/applicationState/Notification";

class UnsupportedModeError extends Error {

    constructor(message: string = "Unsupported exploration mode") {
        super(message);
    }
}

class ExplorationManagerImpl implements ExplorationManager {
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
    
    private async explorePersons(stateManager: ExplorationStateManager<Person, PersonExplorationParams>, service: PersonExplorationService): Promise<Person[]> {
        const mode: ExplorationMode = stateManager.getExplorationParams().mode;

        let results: Person[] = [];

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotNull(stateManager.getExplorationState().params.id);
                const res = service.findById(id);
                results = results.concat(res)
                break;
            }

            case ExplorationMode[ExplorationModeName.BY_FULL_NAME]: {
                const lastName = checkNotNull(stateManager.getExplorationState().params.lastName);
                const middleName = stateManager.getExplorationState().params.middleName;
                const firstName = stateManager.getExplorationState().params.firstName;
                const res = service.findByFullName({lastName, middleName, firstName});
                results = results.concat(res);
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

    private async updatePersons(stateManager: ExplorationStateManager<Person, PersonExplorationParams>, service: PersonExplorationService) {
        try {
            stateManager.enableDataPending();
            // todo: pending notification (IDEA! write condition for time -1 or null for only hand delete)
            const persons: Person[] = await this.explorePersons(stateManager, service);
            stateManager.updateDataResults(persons);
        } catch (e: any) {
            if (e instanceof Error) {
                this.conditionalOutput(notificationTypes.ERROR, e.message)
                console.log(e.message);
            }
        }
        finally {
            stateManager.disableDataPending();
        }
    }

    private async exploreUsers(stateManager: ExplorationStateManager<User, UserExplorationParams>, service: UserExplorationService): Promise<User[]> {
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

    private async updateUsers (stateManager: ExplorationStateManager<User, UserExplorationParams>, service: UserExplorationService) {
        try {
            stateManager.enableDataPending();
            // todo: pending notification (IDEA! write condition for time -1 or null for only hand delete)
            const users: User[] = await this.exploreUsers(stateManager, service);
            stateManager.updateDataResults(users);
        } catch (e: any) {
            if (e instanceof Error) {
                this.conditionalOutput(notificationTypes.ERROR, e.message)
                console.log(e.message);
            }
        }
        finally {
            stateManager.disableDataPending();
        }
    }


    private async exploreJurPersons(stateManager: ExplorationStateManager<JurPerson, JurPersonExplorationParams>, service: JurPersonExplorationService) {
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

    private async updateJurPersons (stateManager: ExplorationStateManager<JurPerson, JurPersonExplorationParams>, service: JurPersonExplorationService) {
        try {
            stateManager.enableDataPending();
            // todo: pending notification (IDEA! write condition for time -1 or null for only hand delete)
            const jurPersons: JurPerson[] = await this.exploreJurPersons(stateManager, service);
            stateManager.updateDataResults(jurPersons);
        } catch (e: any) {
            if (e instanceof Error) {
                this.conditionalOutput(notificationTypes.ERROR, e.message)
                console.log(e.message);
            }
        }
        finally {
            stateManager.disableDataPending();
        }
    }

    explore(entity: Entity) {
        switch (entity) {
            case Entity.PERSON: {
                const stateManager: ExplorationStateManager<Person, PersonExplorationParams> = ExplorationStateManager.getPersonManager(this._store);
                const service = new PersonExplorationServiceImpl();

                this.explorePersons(stateManager, service);
                
                break;
            }
            case Entity.JUR_PERSON: {
                const stateManager = ExplorationStateManager.getJurPersonManager(this._store);
                const service = new JurPersonExplorationServiceImpl();

                this.exploreJurPersons(stateManager, service);

                break;
            }
            case Entity.USER: {
                const stateManager = ExplorationStateManager.getUserManager(this._store);
                const service = new UserExplorationServiceImpl();

                this.exploreUsers(stateManager, service);
            }
        }
    }
}