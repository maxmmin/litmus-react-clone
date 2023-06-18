import store from "../../redux/store";
import CreationService from "./CreationService";
import {Entity} from "../../model/Entity";
import {
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

class CreationServiceImpl implements CreationService {
    private readonly _store: typeof store;
    private readonly authStateManager: AuthenticationStateManager;

    private getAccessToken () {
        return this.authStateManager.getAuth()!.accessToken;
    }

    private async createPerson (params: PersonCreationParams, service: PersonCreationApiService): Promise<Person> {
        return await service.create(params);
    }

    private async createUser (params: UserCreationParams, service: UserCreationApiService): Promise<User> {
        return await service.create(params);
    }

    private async createJurPerson (params: JurPersonCreationParams, service: JurPersonCreationApiService): Promise<JurPerson> {
        return await service.create(params);
    }

    constructor(authStateManager: AuthenticationStateManager = new AuthenticationStateManagerImpl(), _store: typeof store) {
        this._store = _store;
        this.authStateManager = authStateManager;
    }

    async create(entity: Entity): Promise<void> {
    //     switch (entity) {
    //         case Entity.PERSON: {
    //             const personManager = CreationStateManagerFactory.getPersonManager(this._store);
    //
    //             const service = new PersonCreationApiService(this.getAccessToken);
    //
    //             asyncThunk = this.explorePersonsThunk({params: personManager.getExplorationParams(), service: service, globalPending: false})
    //             break;
    //         }
    //         case Entity.JUR_PERSON: {
    //             const jurPersonManager = ExplorationStateManagerImpl.getJurPersonManager(this._store);
    //             stateManager = jurPersonManager;
    //
    //             const service = new JurPersonExplorationApiServiceImpl(this.getAccessToken.bind(this));
    //
    //             asyncThunk = this.exploreJurPersonsThunk({params: jurPersonManager.getExplorationParams(), service: service, globalPending: false})
    //
    //             break;
    //         }
    //         case Entity.USER: {
    //             const userManager = ExplorationStateManagerImpl.getUserManager(this._store);
    //             stateManager = userManager;
    //
    //             const service = new UserExplorationApiServiceImpl(this.getAccessToken.bind(this));
    //
    //             asyncThunk = this.exploreUsersThunk({params: userManager.getExplorationParams(), service: service, globalPending: false})
    //
    //             break;
    //         }
    // }

}}