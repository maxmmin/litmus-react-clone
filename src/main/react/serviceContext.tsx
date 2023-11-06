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
import PersonCreationApiServiceImpl from "../service/creation/api/PersonCreationApiServiceImpl";
import JurPersonCreationApiServiceImpl from "../service/creation/api/JurPersonCreationApiServiceImpl";
import UserCreationApiServiceImpl from "../service/creation/api/UserCreationApiServiceImpl";
import JurPersonDtoMapperImpl from "../rest/dto/dtoMappers/JurPersonDtoMapperImpl";
import UserDtoMapperImpl from "../rest/dto/dtoMappers/UserDtoMapperImpl";
import PersonProcessor from "../service/personProcessing/PersonProcessor";
import PersonRelationsLoader from "../service/personProcessing/PersonRelationsLoader";
import PreprocessedPersonRelationsScanner from "../service/personProcessing/PreprocessedPersonRelationsScanner";
import RipePersonUtil from "../util/person/RipePersonUtil";
import BasicPersonRelationshipsLoader from "../service/personProcessing/BasicPersonRelationshipsLoader";
import BasicPersonProcessor from "../service/personProcessing/BasicPersonProcessor";
import BasicRipePersonUtil from "../util/person/BasicRipePersonUtil";
import UserIdentityDtoMapper from "../rest/dto/dtoMappers/UserIdentityDtoMapper";
import UserIdentityDtoMapperImpl from "../rest/dto/dtoMappers/UserIdentityDtoMapperImpl";
import PersonCreationServiceImpl from "../service/creation/PersonCreationServiceImpl";
import UserCreationServiceImpl from "../service/creation/UserCreationServiceImpl";
import JurPersonCreationServiceImpl from "../service/creation/JurPersonCreationServiceImpl";
import PreprocessedPersonRelationsScannerImpl from "../service/personProcessing/PreprocessedPersonRelationsScannerImpl";
import MapPainter from "../util/map/MapPainter";
import MapPainterImpl from "../util/map/MapPainterImpl";
import JurPersonProcessor from "../service/jurPersonProcessing/JurPersonProcessor";
import RipeJurPersonUtil from "../util/jurPerson/RipeJurPersonUtil";
import BasicRipeJurPersonUtil from "../util/jurPerson/BasicRipeJurPersonUtil";
import BasicJurPersonProcessor from "../service/jurPersonProcessing/BasicJurPersonProcessor";

type Mappers = {
    user: UserDtoMapper,
    person: PersonDtoMapper,
    jurPerson: JurPersonDtoMapper,
    userIdentity: UserIdentityDtoMapper
}

const mappers: Mappers = {
    person: PersonDtoMapperImpl.getInstance(),
    user: new UserDtoMapperImpl(),
    jurPerson: JurPersonDtoMapperImpl.getInstance(),
    userIdentity: new UserIdentityDtoMapperImpl()
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
    fileRepo: FileRepo,
    imageService: ImageRepo
}

const fileService = FileRepoFactory.getGlobalFileService();

const fileContext: FileContext = {
    fileRepo: fileService,
    imageService: new ImageRepoImpl(fileService)
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

const personExplorationStateManager: PersonExplorationStateManager = new PersonExplorationStateManagerImpl();
const jurPersonExplorationStateManager: JurPersonExplorationStateManager = new JurPersonExplorationStateManagerImpl();
const userExplorationStateManager: UserExplorationStateManager = new UserExplorationStateManagerImpl();

const personExplorationApiService: PersonExplorationApiService = new PersonExplorationApiServiceImpl();
const jurPersonExplorationApiService: JurPersonExplorationApiService = new JurPersonExplorationApiServiceImpl();
const userExplorationApiService: UserExplorationApiService = UserExplorationApiServiceImpl.getInstance();

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
        user: new UserExplorationService(userExplorationStateManager,userExplorationApiService, mappers.user),
        person: new PersonExplorationService(personExplorationStateManager, personExplorationApiService, mappers.person),
        jurPerson: new JurPersonExplorationService(jurPersonExplorationStateManager, jurPersonExplorationApiService, mappers.jurPerson)
    }
}

type CreationContext = {
    stateManagers: {
        person: PersonCreationStateManager,
        jurPerson: JurPersonCreationStateManager,
        user: UserCreationStateManager
    },
    apiService: {
        person: PersonCreationApiService,
        jurPerson: JurPersonCreationApiService,
        user: UserCreationApiService
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

const formDataBuilder: MediaEntityFormDataBuilder = new MediaEntityFormDataBuilderImpl(fileContext.fileRepo);

const personCreationApiService: PersonCreationApiService = new PersonCreationApiServiceImpl(formDataBuilder);
const jurPersonCreationApiService: JurPersonCreationApiService = new JurPersonCreationApiServiceImpl(formDataBuilder);
const userCreationApiService: UserCreationApiService = new UserCreationApiServiceImpl();

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
        person: new PersonCreationServiceImpl(personCreationApiService, personCreationStateManager, mappers.person, personCreationValidationService, fileContext.fileRepo),
        user: new UserCreationServiceImpl(userCreationApiService,userCreationStateManager, mappers.user, userCreationValidationService),
        jurPerson: new JurPersonCreationServiceImpl(jurPersonCreationApiService, jurPersonCreationStateManager, mappers.jurPerson, jurPersonCreationValidationService, fileContext.fileRepo)
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

const userIdentityApiService = new UserIdentityApiServiceImpl(mappers.userIdentity);

const userIdentityContext: UserIdentityContext = {
    apiService: userIdentityApiService,
    manager: new UserIdentityManagerImpl(userIdentityApiService)
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

export type ServiceContext = {
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
    personServices: {
        personProcessor: PersonProcessor,
        personRelationshipsLoader: PersonRelationsLoader,
        preprocessedPersonRelationsScanner: PreprocessedPersonRelationsScanner,
        ripePersonUtil: RipePersonUtil
    },
    jurPersonServices: {
        jurPersonProcessor: JurPersonProcessor,
        ripeJurPersonUtil: RipeJurPersonUtil
    },
    mapPainter: MapPainter
}

const relationshipsResponseDtoScanner: PreprocessedPersonRelationsScanner = PreprocessedPersonRelationsScannerImpl.getInstance();

const personRelationshipsLoader: PersonRelationsLoader = BasicPersonRelationshipsLoader.getInstance(
    relationshipsResponseDtoScanner,
    personExplorationApiService,
    mappers.person);

const ripePersonRelationshipsUtil = BasicRipePersonUtil.getInstance();

const personRelationshipsBinder: PersonProcessor = BasicPersonProcessor.getInstance(
    mappers.jurPerson,
    personRelationshipsLoader,
    relationshipsResponseDtoScanner,
    mappers.person,
    ripePersonRelationshipsUtil)

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
    personServices: {
        personProcessor: personRelationshipsBinder,
        personRelationshipsLoader: personRelationshipsLoader,
        preprocessedPersonRelationsScanner: relationshipsResponseDtoScanner,
        ripePersonUtil: ripePersonRelationshipsUtil
    },
    jurPersonServices: {
        ripeJurPersonUtil: new BasicRipeJurPersonUtil(ripePersonRelationshipsUtil),
        jurPersonProcessor: new BasicJurPersonProcessor(personRelationshipsBinder, mappers.jurPerson)
    },
    mapPainter: new MapPainterImpl(ripePersonRelationshipsUtil)
}

export default serviceContext;