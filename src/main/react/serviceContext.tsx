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
import JurPersonExplorationApiService from "../service/exploration/api/jurPerson/JurPersonExplorationApiService";
import UserExplorationApiService from "../service/exploration/api/human/user/UserExplorationApiService";
import PersonCreationStateManager from "../service/creation/stateManager/person/PersonCreationStateManager";
import JurPersonCreationStateManager from "../service/creation/stateManager/jurPerson/JurPersonCreationStateManager";
import UserCreationStateManager from "../service/creation/stateManager/user/UserCreationStateManager";
import PersonCreationApiService from "../service/creation/api/PersonCreationApiService";
import JurPersonCreationApiService from "../service/creation/api/JurPersonCreationApiService";
import UserCreationApiService from "../service/creation/api/UserCreationApiService";
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
import UserDtoMapper from "../rest/dto/dtoMappers/UserDtoMapper";
import PersonDtoMapper from "../rest/dto/dtoMappers/PersonDtoMapper";
import JurPersonDtoMapper from "../rest/dto/dtoMappers/JurPersonDtoMapper";
import PersonCreationValidationServiceImpl
    from "../service/creation/validation/human/person/PersonCreationValidationServiceImpl";
import JurPersonCreationValidationServiceImpl
    from "../service/creation/validation/jurPerson/JurPersonCreationValidationServiceImpl";
import UserCreationValidationServiceImpl
    from "../service/creation/validation/human/user/UserCreationValidationServiceImpl";
import PersonCreationValidationService
    from "../service/creation/validation/human/person/PersonCreationValidationService";
import UserCreationValidationService from "../service/creation/validation/human/user/UserCreationValidationService";
import JurPersonCreationValidationService
    from "../service/creation/validation/jurPerson/JurPersonCreationValidationService";
import FileRepoFactory from "../service/media/FileRepoFactory";
import MediaEntityFormDataBuilder from "../service/creation/api/multipartBuilder/MediaEntityFormDataBuilder";
import MediaEntityFormDataBuilderImpl from "../service/creation/api/multipartBuilder/MediaEntityFormDataBuilderImpl";
import ImageRepoImpl from "../service/media/ImageRepoImpl";
import ImageRepo from "../service/media/ImageRepo";
import FileRepo from "../service/media/FileRepo";
import CsrfTokenLoader from "../service/rest/CsrfTokenLoader";
import BasicCsrfTokenLoader from "../service/rest/BasicCsrfTokenLoader";
import PersonExplorationApiService from "../service/exploration/api/human/person/PersonExplorationApiService";
import GeocodingService from "../service/geocoding/GeocodingService";
import BingGeocodingService from "../service/geocoding/BingGeocodingService";
import appConfig from "../config/appConfig";
import PersonDtoMapperImpl from "../rest/dto/dtoMappers/PersonDtoMapperImpl";
import RelationshipsScanServiceImpl from "../service/relationships/RelationshipsScanServiceImpl";
import RelationshipsScanService from "../service/relationships/RelationshipsScanService";

type Mappers = {
    user: UserDtoMapper,
    person: PersonDtoMapper,
    jurPerson: JurPersonDtoMapper
}

const mappers: Mappers = {
    person: new PersonDtoMapperImpl(),
    user: new UserDtoMapper(),
    jurPerson: new JurPersonDtoMapper()
}

type AuthContext = {
    stateManager: AuthenticationStateManager
    apiService: AuthApiService,
    manager: AuthenticationManager
}

const authStateManager = new AuthenticationStateManagerImpl();

const authContext: AuthContext = {
    stateManager: authStateManager,
    apiService: new BasicAuthApiService(),
    manager: BasicAuthenticationManager.getInstance()
}

type FileContext = {
    fileService: FileRepo,
    imageService: ImageRepo
}

const fileService = FileRepoFactory.getGlobalFileService();

const fileContext: FileContext = {
    fileService: fileService,
    imageService: ImageRepoImpl.getInstance(fileService)
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
        jurPerson: JurPersonExplorationService,
        person: PersonExplorationService,
        user: UserExplorationService
    }
}

const personExplorationStateManager = new PersonExplorationStateManagerImpl();
const jurPersonExplorationStateManager = new JurPersonExplorationStateManagerImpl();
const userExplorationStateManager = new UserExplorationStateManagerImpl();

const personExplorationApiService = PersonExplorationApiServiceImpl.getInstance();
const jurPersonExplorationApiService = JurPersonExplorationApiServiceImpl.getInstance();
const userExplorationApiService = UserExplorationApiServiceImpl.getInstance();

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
        user: UserExplorationService.getInstance(userExplorationStateManager,userExplorationApiService, mappers.user),
        person: PersonExplorationService.getInstance(personExplorationStateManager, personExplorationApiService, mappers.person),
        jurPerson: JurPersonExplorationService.getInstance(jurPersonExplorationStateManager, jurPersonExplorationApiService, mappers.jurPerson)
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
    },
    formDataBuilder: MediaEntityFormDataBuilder,
}

const formDataBuilder = MediaEntityFormDataBuilderImpl.getInstance(fileContext.fileService);

const personCreationApiService = PersonCreationApiService.getInstance(formDataBuilder);
const jurPersonCreationApiService = JurPersonCreationApiService.getInstance();
const userCreationApiService = UserCreationApiService.getInstance();

const personCreationStateManager = new PersonCreationStateManagerImpl();
const jurPersonCreationStateManager = new JurPersonCreationStateManagerImpl();
const userCreationStateManager = new UserCreationStateManagerImpl();

const personCreationValidationService = new PersonCreationValidationServiceImpl();
const jurPersonCreationValidationService = new JurPersonCreationValidationServiceImpl();
const userCreationValidationService = new UserCreationValidationServiceImpl();

const geocodingService = new BingGeocodingService(appConfig.geoApiKey);

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
        person: PersonCreationService.getInstance(personCreationApiService, personCreationStateManager, mappers.person, personCreationValidationService, fileContext.fileService),
        user: UserCreationService.getInstance(userCreationApiService,userCreationStateManager, mappers.user, userCreationValidationService),
        jurPerson: JurPersonCreationService.getInstance(jurPersonCreationApiService, jurPersonCreationStateManager, mappers.jurPerson, jurPersonCreationValidationService)
    },
    validation: {
        person: personCreationValidationService,
        jurPerson: jurPersonCreationValidationService,
        user: userCreationValidationService
    },
    formDataBuilder: formDataBuilder
}

type UserIdentityContext = {
    apiService: UserIdentityApiService,
    manager: UserIdentityManager
}

const userIdentityApiService = UserIdentityApiServiceImpl.getInstance();

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
    notification: NotificationContext,
    files: FileContext,
    mappers: Mappers,
    csrfTokenLoader: CsrfTokenLoader,
    geocodingService: GeocodingService,
    relationshipsScanService: RelationshipsScanService
}

const serviceContext: ServiceContext = {
    auth: authContext,
    exploration: explorationContext,
    creation: creationContext,
    appState: appStateContext,
    userIdentity: userIdentityContext,
    notification: notificationContext,
    files: fileContext,
    mappers: mappers,
    csrfTokenLoader: new BasicCsrfTokenLoader(),
    geocodingService: geocodingService,
    relationshipsScanService: RelationshipsScanServiceImpl.getInstance(personExplorationApiService, mappers.person)
}

export default serviceContext;