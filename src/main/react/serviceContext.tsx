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
import UserCreationService from "../service/creation/UserCreationService";
import JurPersonCreationService from "../service/creation/JurPersonCreationService";
import ApplicationStateManager from "../service/appState/ApplicationStateManager";
import {NotificationManager} from "../redux/types/applicationState/Notification";
import {BasicNotificationManager} from "../redux/types/applicationState/BasicNotificationManager";
import PersonExplorationValidationServiceImpl
    from "../service/exploration/validation/human/person/PersonExplorationValidationServiceImpl";
import UserExplorationValidationServiceImpl
    from "../service/exploration/validation/human/user/UserExplorationValidationServiceImpl";
import JurPersonExplorationValidationServiceImpl
    from "../service/exploration/validation/jurPerson/JurPersonExplorationValidationServiceImpl";
import PersonExplorationValidationService
    from "../service/exploration/validation/human/person/PersonExplorationValidationService";
import JurPersonExplorationValidationService
    from "../service/exploration/validation/jurPerson/JurPersonExplorationValidationService";
import UserExplorationValidationService
    from "../service/exploration/validation/human/user/UserExplorationValidationService";
import UserDtoMapper from "../rest/dto/dtoMappers/UserDtoMapper";
import PersonDtoMapper from "../rest/dto/dtoMappers/PersonDtoMapper";
import JurPersonDtoMapper from "../rest/dto/dtoMappers/JurPersonDtoMapper";
import userDtoMapper from "../rest/dto/dtoMappers/UserDtoMapper";
import PersonCreationValidationServiceImpl
    from "../service/creation/validation/human/person/PersonCreationValidationServiceImpl";
import JurPersonCreationValidationServiceImpl
    from "../service/creation/validation/jurPerson/JurPersonCreationValidationServiceImpl";
import UserCreationValidationServiceImpl
    from "../service/creation/validation/human/user/UserCreationValidationServiceImpl";
import personDtoMapper from "../rest/dto/dtoMappers/PersonDtoMapper";
import PersonCreationValidationService
    from "../service/creation/validation/human/person/PersonCreationValidationService";
import UserCreationValidationService from "../service/creation/validation/human/user/UserCreationValidationService";
import JurPersonCreationValidationService
    from "../service/creation/validation/jurPerson/JurPersonCreationValidationService";

const dtoUserMapper = new UserDtoMapper();
const dtoPersonMapper = new PersonDtoMapper();
const dtoJurPersonMapper = new JurPersonDtoMapper();

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
    validation: {
        person: PersonExplorationValidationService,
        jurPerson: JurPersonExplorationValidationService,
        user: UserExplorationValidationService
    }
    service: {
        jurPerson: JurPersonExplorationService,
        person: PersonExplorationService,
        user: UserExplorationService
    }
}

const personExplorationStateManager = new PersonExplorationStateManagerImpl();
const jurPersonExplorationStateManager = new JurPersonExplorationStateManagerImpl();
const userExplorationStateManager = new UserExplorationStateManagerImpl();

const personExplorationApiService = PersonExplorationApiServiceImpl.getInstance(authContext.stateManager);
const jurPersonExplorationApiService = JurPersonExplorationApiServiceImpl.getInstance(authContext.stateManager);
const userExplorationApiService = UserExplorationApiServiceImpl.getInstance(authContext.stateManager);

const personExplorationValidationService = new PersonExplorationValidationServiceImpl();
const userExplorationValidationService = new UserExplorationValidationServiceImpl();
const jurPersonExplorationValidationService = new JurPersonExplorationValidationServiceImpl();

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
    validation: {
      person: personExplorationValidationService,
      jurPerson: jurPersonExplorationValidationService,
      user: userExplorationValidationService
    },
    service: {
        user: UserExplorationService.getInstance(userExplorationStateManager,userExplorationApiService, dtoUserMapper, userExplorationValidationService),
        person: PersonExplorationService.getInstance(personExplorationStateManager, personExplorationApiService, dtoPersonMapper, personExplorationValidationService),
        jurPerson: JurPersonExplorationService.getInstance(jurPersonExplorationStateManager, jurPersonExplorationApiService, dtoJurPersonMapper,jurPersonExplorationValidationService)
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
        person: PersonCreationService,
        user: UserCreationService,
        jurPerson: JurPersonCreationService
    },
    validation: {
        person: PersonCreationValidationService,
        jurPerson: JurPersonCreationValidationService,
        user: UserCreationValidationService
    }
}

const personCreationApiService = PersonCreationApiService.getInstance(authContext.stateManager);
const jurPersonCreationApiService = JurPersonCreationApiService.getInstance(authContext.stateManager);
const userCreationApiService = UserCreationApiService.getInstance(authContext.stateManager);

const personCreationStateManager = new PersonCreationStateManagerImpl();
const jurPersonCreationStateManager = new JurPersonCreationStateManagerImpl();
const userCreationStateManager = new UserCreationStateManagerImpl();

const personCreationValidationService = new PersonCreationValidationServiceImpl();
const jurPersonCreationValidationService = new JurPersonCreationValidationServiceImpl();
const userCreationValidationService = new UserCreationValidationServiceImpl();

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
        person: PersonCreationService.getInstance(personCreationApiService, personCreationStateManager, dtoPersonMapper, personCreationValidationService),
        user: UserCreationService.getInstance(userCreationApiService,userCreationStateManager, dtoUserMapper, userCreationValidationService),
        jurPerson: JurPersonCreationService.getInstance(jurPersonCreationApiService, jurPersonCreationStateManager, dtoJurPersonMapper, jurPersonCreationValidationService)
    },
    validation: {
        person: personCreationValidationService,
        jurPerson: jurPersonCreationValidationService,
        user: userCreationValidationService
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