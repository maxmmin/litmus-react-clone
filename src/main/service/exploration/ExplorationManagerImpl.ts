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

class UnsupportedModeError extends Error {

    constructor(message?: string = "Unsupported exploration mode") {
        super(message);
    }
}

class ExplorationManagerImpl implements ExplorationManager {
    private readonly _store: typeof store;


    constructor(providedStore: typeof store) {
        this._store = providedStore;
    }
    
    private async explorePersons(stateManager: ExplorationStateManager<Person, PersonExplorationParams>, service: PersonExplorationService) {
        const mode: ExplorationMode = stateManager.getExplorationParams().mode;

        let result: Promise<Response>|null = null;

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotNull(stateManager.getExplorationState().params.id);
                const res = service.findById(id);
                break;
            }

            case ExplorationMode[ExplorationModeName.BY_FULL_NAME]: {
                const lastName = checkNotNull(stateManager.getExplorationState().params.lastName);
                const middleName = stateManager.getExplorationState().params.middleName;
                const firstName = stateManager.getExplorationState().params.firstName
                const res = service.findByFullName({lastName, middleName, firstName})
                break;
            }

            default: {
                if (PersonExplorationParams.supportedModes.includes(mode)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();
            };
        }

    }

    private async exploreUsers(stateManager: ExplorationStateManager<User, UserExplorationParams>, service: UserExplorationService) {
        const mode: ExplorationMode = stateManager.getExplorationParams().mode;

        let result: Promise<Response>|null = null;

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_FULL_NAME]: {
                const lastName = checkNotNull(stateManager.getExplorationState().params.lastName);
                const middleName = stateManager.getExplorationState().params.middleName;
                const firstName = stateManager.getExplorationState().params.firstName
                const res = service.findByFullName({lastName, middleName, firstName})
                break;
            }

            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotNull(stateManager.getExplorationState().params.id);
                const res = service.findById(id);
                break;
            }

            default: {
                if (PersonExplorationParams.supportedModes.includes(mode)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();
            };
        }
    }

    private async exploreJurPersons(stateManager: ExplorationStateManager<JurPerson, JurPersonExplorationParams>, service: JurPersonExplorationService) {
        const mode: ExplorationMode = stateManager.getExplorationParams().mode;

        let result: Promise<Response>|null = null;

        switch (mode) {
            case ExplorationMode[ExplorationModeName.BY_ID]: {
                const id = checkNotNull(stateManager.getExplorationState().params.id);
                const res = service.findById(id);
                break;
            }

            default: {
                if (PersonExplorationParams.supportedModes.includes(mode)) {
                    throw new Error("mod is supported by person exploration params but isn't added to switch branch")
                } else throw new UnsupportedModeError();}
            }
    }

    explore(entity: Entity): void {
        switch (entity) {
            case Entity.PERSON: {
                const stateManager: ExplorationStateManager<Person, PersonExplorationParams> = ExplorationStateManager.getManager(this._store, Entity.PERSON) as ExplorationStateManager<Person, PersonExplorationParams>;
                const mode: ExplorationMode = stateManager.getExplorationParams().mode;
                
                const service = new PersonExplorationServiceImpl();
                
                switch (mode) {
                    case ExplorationMode[ExplorationModeName.BY_ID]: {
                        
                    }    
                }
                
                break;
            }
            case Entity.JUR_PERSON: {
                const stateManager = ExplorationStateManager.getManager(this._store, Entity.JUR_PERSON);
                const mode: ExplorationMode = (stateManager.getExplorationParams() as EntityExplorationParams).mode;
                const service = new JurPersonExplorationServiceImpl();
                break;
            }
            case Entity.USER: {
                const stateManager = ExplorationStateManager.getManager(this._store, Entity.USER);
                const mode: ExplorationMode = (stateManager.getExplorationParams() as EntityExplorationParams).mode;
                const service = new UserExplorationServiceImpl();
            }
        }
    }
}