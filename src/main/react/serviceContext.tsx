import AuthenticationStateManager from "../service/auth/stateManager/AuthenticationStateManager";
import AuthApiService from "../service/auth/api/AuthApiService";
import AuthenticationManager from "../service/auth/AuthenticationManager";
import BasicAuthenticationManager from "../service/auth/BasicAuthenticationManager";
import BasicAuthApiService from "../service/auth/api/BasicAuthApiService";
import AuthenticationStateManagerImpl from "../service/auth/stateManager/AuthenticationStateManagerImpl";
import PersonExplorationStateManager from "../service/exploration/stateManager/person/PersonExplorationStateManager";
import JurPersonExplorationStateManager
    from "../service/exploration/stateManager/jurPerson/JurPersonExplorationStateManager";
import UserExplorationStateManager from "../service/exploration/stateManager/user/UserExplorationStateManager";
import PersonExplorationApiService from "../service/exploration/api/human/person/PersonExplorationApiService";
import JurPersonExplorationApiService from "../service/exploration/api/jurPerson/JurPersonExplorationApiService";
import UserExplorationApiService from "../service/exploration/api/human/user/UserExplorationApiService";
import ExplorationService from "../service/exploration/ExplorationService";
import PersonCreationStateManager from "../service/creation/stateManager/person/PersonCreationStateManager";
import JurPersonCreationStateManager from "../service/creation/stateManager/jurPerson/JurPersonCreationStateManager";
import UserCreationStateManager from "../service/creation/stateManager/user/UserCreationStateManager";
import PersonCreationApiService from "../service/creation/api/PersonCreationApiService";
import JurPersonCreationApiService from "../service/creation/api/JurPersonCreationApiService";
import UserCreationApiService from "../service/creation/api/UserCreationApiService";
import TimersStateManager from "../service/timers/TimersStateManager";
import PersonCreationStateManagerImpl from "../service/creation/stateManager/person/PersonCreationStateManagerImpl";
import JurPersonCreationStateManagerImpl
    from "../service/creation/stateManager/jurPerson/JurPersonCreationStateManagerImpl";
import UserCreationStateManagerImpl from "../service/creation/stateManager/user/UserCreationStateManagerImpl";
import CreationApiService from "../service/creation/api/CreationApiService";
import PersonResponseDto from "../rest/dto/person/PersonResponseDto";
import JurPersonResponseDto from "../rest/dto/jurPerson/JurPersonResponseDto";
import UserResponseDto from "../rest/dto/user/UserResponseDto";
import PersonRequestDto from "../rest/dto/person/PersonRequestDto";
import JurPersonRequestDto from "../rest/dto/jurPerson/JurPersonRequestDto";
import UserRequestDto from "../rest/dto/user/UserRequestDto";
import PersonExplorationService from "../service/exploration/PersonExplorationService";
import UserExplorationService from "../service/exploration/UserExplorationService";
import JurPersonExplorationService from "../service/exploration/JurPersonExplorationService";
import PersonExplorationStateManagerImpl
    from "../service/exploration/stateManager/person/PersonExplorationStateManagerImpl";
import UserExplorationStateManagerImpl
    from "../service/exploration/stateManager/user/UserExplorationStateManagerImpl";
import JurPersonExplorationStateManagerImpl
    from "../service/exploration/stateManager/jurPerson/JurPersonExplorationStateManagerImpl";
import PersonExplorationApiServiceImpl
    from "../service/exploration/api/human/person/PersonExplorationApiServiceImpl";
import UserExplorationApiServiceImpl from "../service/exploration/api/human/user/UserExplorationApiServiceImpl";
import JurPersonExplorationApiServiceImpl
    from "../service/exploration/api/jurPerson/JurPersonExplorationApiServiceImpl";
import UserIdentityApiService from "../service/userIdentity/api/UserIdentityApiService";
import UserIdentityManager from "../service/userIdentity/UserIdentityManager";
import UserIdentityApiServiceImpl from "../service/userIdentity/api/UserIdentityApiServiceImpl";
import UserIdentityManagerImpl from "../service/userIdentity/UserIdentityManagerImpl";
import PersonCreationService from "../service/creation/PersonCreationService";
import CreationService from "../service/creation/CreationService";
import UserCreationService from "../service/creation/UserCreationService";
import JurPersonCreationService from "../service/creation/JurPersonCreationService";
import ApplicationStateManager from "../service/appState/ApplicationStateManager";
import {NotificationManager} from "../redux/types/applicationState/Notification";
import {BasicNotificationManager} from "../redux/types/applicationState/BasicNotificationManager";

type AuthContext = {
    stateManager: AuthenticationStateManager
    apiService: AuthApiService,
    manager: AuthenticationManager
}

const authContext: AuthContext = {
    stateManager: new AuthenticationStateManagerImpl(),
    apiService: new BasicAuthApiService(),
    manager: BasicAuthenticationManager.getInstance()
}

type ExplorationContext = {
    stateManagers: {
        person: PersonExplorationStateManager,
        jurPerson: JurPersonExplorationStateManager,
        user: UserExplorationStateManager
    },
    apiService: {
        person: PersonExplorationApiService,
        jurPerson: JurPersonExplorationApiService,
        user: UserExplorationApiService
    },
    service: {
        jurPerson: ExplorationService,
        person: ExplorationService,
        user: ExplorationService
    }
}

const personExplorationStateManager = new PersonExplorationStateManagerImpl();
const jurPersonExplorationStateManager = new JurPersonExplorationStateManagerImpl();
const userExplorationStateManager = new UserExplorationStateManagerImpl();

const personExplorationApiService = PersonExplorationApiServiceImpl.getInstance(authContext.stateManager);
const jurPersonExplorationApiService = JurPersonExplorationApiServiceImpl.getInstance(authContext.stateManager);
const userExplorationApiService = UserExplorationApiServiceImpl.getInstance(authContext.stateManager);

const explorationContext: ExplorationContext = {
    stateManagers: {
        person: personExplorationStateManager,
        user: userExplorationStateManager,
        jurPerson: jurPersonExplorationStateManager
    },
    apiService: {
        person: personExplorationApiService,
        user: userExplorationApiService,
        jurPerson: jurPersonExplorationApiService
    },
    service: {
        user: UserExplorationService.getInstance(userExplorationStateManager,userExplorationApiService),
        person: PersonExplorationService.getInstance(personExplorationStateManager, personExplorationApiService),
        jurPerson: JurPersonExplorationService.getInstance(jurPersonExplorationStateManager, jurPersonExplorationApiService)
    }
}

type CreationContext = {
    stateManagers: {
        person: PersonCreationStateManager,
        jurPerson: JurPersonCreationStateManager,
        user: UserCreationStateManager
    },
    apiService: {
        person: CreationApiService<PersonRequestDto, PersonResponseDto>,
        jurPerson: CreationApiService<JurPersonRequestDto, JurPersonResponseDto>,
        user: CreationApiService<UserRequestDto, UserResponseDto>
    },
    service: {
        person: CreationService,
        user: CreationService,
        jurPerson: CreationService
    }
}

const personCreationApiService = PersonCreationApiService.getInstance(authContext.stateManager);
const jurPersonCreationApiService = JurPersonCreationApiService.getInstance(authContext.stateManager);
const userCreationApiService = UserCreationApiService.getInstance(authContext.stateManager);

const personCreationStateManager = new PersonCreationStateManagerImpl();
const jurPersonCreationStateManager = new JurPersonCreationStateManagerImpl();
const userCreationStateManager = new UserCreationStateManagerImpl();

const creationContext: CreationContext = {
    apiService: {
      person: personCreationApiService,
      jurPerson: jurPersonCreationApiService,
      user: userCreationApiService
    },
    stateManagers: {
        person: personCreationStateManager,
        jurPerson: jurPersonCreationStateManager,
        user: userCreationStateManager
    },
    service: {
        person: PersonCreationService.getInstance(personCreationApiService, personCreationStateManager),
        user: UserCreationService.getInstance(userCreationApiService,userCreationStateManager),
        jurPerson: JurPersonCreationService.getInstance(jurPersonCreationApiService, jurPersonCreationStateManager)
    }
}

type TimersContext = {
    manager: TimersStateManager
}

const timersContext: TimersContext = {
    manager: new TimersStateManager()
}

type UserIdentityContext = {
    apiService: UserIdentityApiService,
    manager: UserIdentityManager
}

const userIdentityApiService = UserIdentityApiServiceImpl.getInstance(authContext.stateManager);

const userIdentityContext: UserIdentityContext = {
    apiService: userIdentityApiService,
    manager: UserIdentityManagerImpl.getInstance(userIdentityApiService)
}

type AppStateContext = {
    manager: ApplicationStateManager
}

const appStateContext: AppStateContext = {
    manager: new ApplicationStateManager()
}

type NotificationContext = {
    manager: NotificationManager
}

const notificationContext: NotificationContext = {
    manager: new BasicNotificationManager()
}

type ServiceContext = {
    auth: AuthContext,
    exploration: ExplorationContext,
    creation: CreationContext,
    appState: AppStateContext,
    userIdentity: UserIdentityContext,
    timers: TimersContext,
    notification: NotificationContext
}

const serviceContext: ServiceContext = {
    auth: authContext,
    exploration: explorationContext,
    creation: creationContext,
    appState: appStateContext,
    userIdentity: userIdentityContext,
    timers: timersContext,
    notification: notificationContext
}

export default serviceContext;