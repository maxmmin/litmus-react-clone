import AuthenticationStateManager from "./service/stateManagers/auth/AuthenticationStateManager";
import AuthApiService from "./service/coreServices/auth/api/AuthApiService";
import AuthenticationManager from "./service/coreServices/auth/AuthenticationManager";
import BasicAuthenticationManager from "./service/coreServices/auth/BasicAuthenticationManager";
import BasicAuthApiService from "./service/coreServices/auth/api/BasicAuthApiService";
import AuthenticationStateManagerImpl from "./service/stateManagers/auth/AuthenticationStateManagerImpl";
import PersonExplorationStateManager from "./service/stateManagers/exploration/person/PersonExplorationStateManager";
import JurPersonExplorationStateManager
    from "./service/stateManagers/exploration/jurPerson/JurPersonExplorationStateManager";
import UserExplorationStateManager from "./service/stateManagers/exploration/user/UserExplorationStateManager";
import JurPersonExplorationApiService from "./service/api/jur-person/exploration/JurPersonExplorationApiService";
import UserExplorationApiService from "./service/api/user/exploration/UserExplorationApiService";
import PersonCreationStateManager from "./service/stateManagers/creation/person/PersonCreationStateManager";
import JurPersonCreationStateManager from "./service/stateManagers/creation/jurPerson/JurPersonCreationStateManager";
import UserCreationStateManager from "./service/stateManagers/creation/user/UserCreationStateManager";
import PersonCreationApiService from "./service/api/person/creation/PersonCreationApiService";
import JurPersonCreationApiService from "./service/api/jur-person/creation/JurPersonCreationApiService";
import UserCreationApiService from "./service/api/user/creation/UserCreationApiService";
import PersonCreationStateManagerImpl from "./service/stateManagers/creation/person/PersonCreationStateManagerImpl";
import JurPersonCreationStateManagerImpl
    from "./service/stateManagers/creation/jurPerson/JurPersonCreationStateManagerImpl";
import UserCreationStateManagerImpl from "./service/stateManagers/creation/user/UserCreationStateManagerImpl";
import PersonExplorationService from "./service/coreServices/exploration/PersonExplorationService";
import UserExplorationService from "./service/coreServices/exploration/UserExplorationService";
import JurPersonExplorationService from "./service/coreServices/exploration/JurPersonExplorationService";
import PersonExplorationStateManagerImpl
    from "./service/stateManagers/exploration/person/PersonExplorationStateManagerImpl";
import UserExplorationStateManagerImpl
    from "./service/stateManagers/exploration/user/UserExplorationStateManagerImpl";
import JurPersonExplorationStateManagerImpl
    from "./service/stateManagers/exploration/jurPerson/JurPersonExplorationStateManagerImpl";
import PersonExplorationApiServiceImpl
    from "./service/api/person/exploration/PersonExplorationApiServiceImpl";
import UserExplorationApiServiceImpl from "./service/api/user/exploration/UserExplorationApiServiceImpl";
import JurPersonExplorationApiServiceImpl
    from "./service/api/jur-person/exploration/JurPersonExplorationApiServiceImpl";
import UserIdentityApiService from "./service/api/userIdentity/UserIdentityApiService";
import UserIdentityManager from "./service/coreServices/userIdentity/UserIdentityManager";
import UserIdentityApiServiceImpl from "./service/api/userIdentity/UserIdentityApiServiceImpl";
import UserIdentityManagerImpl from "./service/coreServices/userIdentity/UserIdentityManagerImpl";
import PersonCreationService from "./service/coreServices/creation/PersonCreationService";
import UserCreationService from "./service/coreServices/creation/UserCreationService";
import JurPersonCreationService from "./service/coreServices/creation/JurPersonCreationService";
import ApplicationGlobalStateManager from "./service/stateManagers/applicationGlobalState/ApplicationGlobalStateManager";
import {NotificationManager} from "./redux/types/applicationState/Notification";
import {BasicNotificationManager} from "./redux/types/applicationState/BasicNotificationManager";
import UserDtoMapper from "./service/dtoMappers/user/UserDtoMapper";
import PersonDtoMapper from "./service/dtoMappers/person/PersonDtoMapper";
import JurPersonDtoMapper from "./service/dtoMappers/jurPerson/JurPersonDtoMapper";
import PersonCreationValidationServiceImpl
    from "./service/validation/human/person/PersonCreationValidationServiceImpl";
import JurPersonCreationValidationServiceImpl
    from "./service/validation/jurPerson/JurPersonCreationValidationServiceImpl";
import UserCreationValidationServiceImpl
    from "./service/validation/human/user/UserCreationValidationServiceImpl";
import PersonCreationValidationService
    from "./service/validation/human/person/PersonCreationValidationService";
import UserCreationValidationService from "./service/validation/human/user/UserCreationValidationService";
import JurPersonCreationValidationService
    from "./service/validation/jurPerson/JurPersonCreationValidationService";
import FileRepoFactory from "./service/media/FileRepoFactory";
import MediaEntityFormDataBuilder from "./service/multipartBuilder/MediaEntityFormDataBuilder";
import MediaEntityFormDataBuilderImpl from "./service/multipartBuilder/MediaEntityFormDataBuilderImpl";
import ImageRepoImpl from "./service/media/ImageRepoImpl";
import ImageRepo from "./service/media/ImageRepo";
import FileRepo from "./service/media/FileRepo";
import CsrfTokenLoader from "./service/api/core/CsrfTokenLoader";
import BasicCsrfTokenLoader from "./service/api/core/BasicCsrfTokenLoader";
import PersonExplorationApiService from "./service/api/person/exploration/PersonExplorationApiService";
import GeocodingService from "./service/geocoding/GeocodingService";
import BingGeocodingService from "./service/geocoding/BingGeocodingService";
import appConfig from "./config/appConfig";
import PersonDtoMapperImpl from "./service/dtoMappers/person/PersonDtoMapperImpl";
import PersonCreationApiServiceImpl from "./service/api/person/creation/PersonCreationApiServiceImpl";
import JurPersonCreationApiServiceImpl from "./service/api/jur-person/creation/JurPersonCreationApiServiceImpl";
import UserCreationApiServiceImpl from "./service/api/user/creation/UserCreationApiServiceImpl";
import JurPersonDtoMapperImpl from "./service/dtoMappers/jurPerson/JurPersonDtoMapperImpl";
import UserDtoMapperImpl from "./service/dtoMappers/user/UserDtoMapperImpl";
import PersonProcessor from "./service/personProcessing/PersonProcessor";
import PersonRelationsLoader from "./service/personProcessing/PersonRelationsLoader";
import PreprocessedPersonRelationsScanner from "./service/personProcessing/PreprocessedPersonRelationsScanner";
import RipePersonUtil from "./util/person/RipePersonUtil";
import BasicPersonRelationshipsLoader from "./service/personProcessing/BasicPersonRelationshipsLoader";
import BasicPersonProcessor from "./service/personProcessing/BasicPersonProcessor";
import BasicRipePersonUtil from "./util/person/BasicRipePersonUtil";
import UserIdentityDtoMapper from "./service/dtoMappers/userIdentity/UserIdentityDtoMapper";
import UserIdentityDtoMapperImpl from "./service/dtoMappers/userIdentity/UserIdentityDtoMapperImpl";
import PersonCreationServiceImpl from "./service/coreServices/creation/PersonCreationServiceImpl";
import UserCreationServiceImpl from "./service/coreServices/creation/UserCreationServiceImpl";
import JurPersonCreationServiceImpl from "./service/coreServices/creation/JurPersonCreationServiceImpl";
import PreprocessedPersonRelationsScannerImpl from "./service/personProcessing/PreprocessedPersonRelationsScannerImpl";
import MapPainter from "./util/map/MapPainter";
import MapPainterImpl from "./util/map/MapPainterImpl";
import JurPersonProcessor from "./service/jurPersonProcessing/JurPersonProcessor";
import RipeJurPersonUtil from "./util/jurPerson/RipeJurPersonUtil";
import BasicRipeJurPersonUtil from "./util/jurPerson/BasicRipeJurPersonUtil";
import BasicJurPersonProcessor from "./service/jurPersonProcessing/BasicJurPersonProcessor";
import PersonMapTool from "./util/map/person/PersonMapTool";
import BasicPersonMapTool from "./util/map/person/BasicPersonMapTool";
import BasicMapUtil from "./util/map/util/BasicMapUtil";
import MapUtil from "./util/map/util/MapUtil";
import BasicJurPersonMapTool from "./util/map/jurPerson/BasicJurPersonMapTool";
import JurPersonMapTool from "./util/map/jurPerson/JurPersonMapTool";
import ApplicationGlobalStateManagerImpl from "./service/stateManagers/applicationGlobalState/ApplicationGlobalStateManagerImpl";
import PersonApiService from "./service/api/person/PersonApiService";
import PersonApiServiceImpl from "./service/api/person/PersonApiServiceImpl";
import JurPersonApiService from "./service/api/jur-person/JurPersonApiService";
import JurPersonApiServiceImpl from "./service/api/jur-person/JurPersonApiServiceImpl";
import UserApiService from "./service/api/user/UserApiService";
import UserApiServiceImpl from "./service/api/user/UserApiServiceImpl";
import RoleDtoMapper from "./service/dtoMappers/user/RoleDtoMapper";
import RoleDtoMapperImpl from "./service/dtoMappers/user/RoleDtoMapperImpl";
import ApplicationResourcesStateManager from "./service/stateManagers/applicationResources/ApplicationResourcesStateManager";
import ApplicationResourcesStateManagerImpl from "./service/stateManagers/applicationResources/ApplicationResourcesStateManagerImpl";
import ApplicationResourcesApiService from "./service/api/appResources/ApplicationResourcesApiService";
import ApplicationResourcesService from "./service/coreServices/applicationResources/ApplicationResourcesService";
import ApplicationResourcesApiServiceImpl from "./service/api/appResources/ApplicationResourcesApiServiceImpl";
import ApplicationResourcesServiceImpl
    from "./service/coreServices/applicationResources/ApplicationResourcesServiceImpl";
import BasicHierarchyPermissionsChecker from "./service/userHierarchy/BasicHierarchyPermissionsChecker";
import HierarchyPermissionChecker from "./service/userHierarchy/HierarchyPermissionChecker";
import MetadataDtoMapper from "./service/dtoMappers/metadata/MetadataDtoMapper";
import MetadataDtoMapperImpl from "./service/dtoMappers/metadata/MetadataDtoMapperImpl";
import UserShortDtoMapper from "./service/dtoMappers/user/UserShortDtoMapper";
import UserShortDtoMapperImpl from "./service/dtoMappers/user/UserShortDtoMapperImpl";
import LinkValidator from "./service/validation/link/LinkValidator";
import SimpleLinkValidator from "./service/validation/link/SimpleLinkValidator";
import GeneralWebArchiver from "./service/api/webArch/general/GeneralWebArchiver";
import WayBackMachineArchiver from "./service/api/webArch/wayback/WayBackMachineArchiver";
import SimpleWayBackMachineArchiver from "./service/api/webArch/wayback/SimpleWayBackMachineArchiver";
import GeneralWebArchiverImpl from "./service/api/webArch/general/GeneralWebArchiverImpl";

type Mappers = {
    user: {
        short: UserShortDtoMapper,
        default: UserDtoMapper
    },
    person: PersonDtoMapper,
    jurPerson: JurPersonDtoMapper,
    userIdentity: UserIdentityDtoMapper,
    role: RoleDtoMapper,
    metadata: MetadataDtoMapper
}

const roleMapper: RoleDtoMapper = new RoleDtoMapperImpl();
const applicationResourcesStateManager: ApplicationResourcesStateManager = new ApplicationResourcesStateManagerImpl(roleMapper);

const userShortDtoMapper: UserShortDtoMapper = new UserShortDtoMapperImpl(applicationResourcesStateManager);
const metadataDtoMapper: MetadataDtoMapper = new MetadataDtoMapperImpl(userShortDtoMapper);

const personMapper: PersonDtoMapper = new PersonDtoMapperImpl(metadataDtoMapper);
const jurPersonMapper: JurPersonDtoMapper = new JurPersonDtoMapperImpl(personMapper, metadataDtoMapper);

const userMapper: UserDtoMapper = new UserDtoMapperImpl(personMapper, jurPersonMapper, applicationResourcesStateManager, metadataDtoMapper, userShortDtoMapper);

const mappers: Mappers = {
    person: personMapper,
    user: {
        short: userShortDtoMapper,
        default: userMapper
    },
    jurPerson: jurPersonMapper,
    userIdentity: new UserIdentityDtoMapperImpl(applicationResourcesStateManager, metadataDtoMapper),
    role: roleMapper,
    metadata: metadataDtoMapper
}

export type ApplicationResourcesContext = {
    stateManager: ApplicationResourcesStateManager,
    api: ApplicationResourcesApiService,
    service: ApplicationResourcesService
}

const applicationResourcesApiService: ApplicationResourcesApiService = new ApplicationResourcesApiServiceImpl();

const applicationResourcesContext: ApplicationResourcesContext = {
    stateManager: applicationResourcesStateManager,
    api: applicationResourcesApiService,
    service: new ApplicationResourcesServiceImpl(applicationResourcesStateManager, applicationResourcesApiService, roleMapper)
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
const userExplorationApiService: UserExplorationApiService = new UserExplorationApiServiceImpl();

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
        user: new UserExplorationService(userExplorationStateManager,userExplorationApiService, mappers.user.default),
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

const wayBackArchiver: WayBackMachineArchiver = new SimpleWayBackMachineArchiver();

const webArchContext: WebArchContext = {
    wayBack: wayBackArchiver,
    general: new GeneralWebArchiverImpl(wayBackArchiver)
}

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
        person: new PersonCreationServiceImpl(personCreationApiService, personCreationStateManager, mappers.person, personCreationValidationService, fileContext.fileRepo, webArchContext.general),
        user: new UserCreationServiceImpl(userCreationApiService,userCreationStateManager, mappers.user.default, userCreationValidationService),
        jurPerson: new JurPersonCreationServiceImpl(jurPersonCreationApiService, jurPersonCreationStateManager, mappers.jurPerson, jurPersonCreationValidationService, fileContext.fileRepo, webArchContext.general)
    },
    validation: {
        person: personCreationValidationService,
        jurPerson: jurPersonCreationValidationService,
        user: userCreationValidationService,
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
    manager: new UserIdentityManagerImpl(userIdentityApiService, mappers.userIdentity)
}

type AppStateContext = {
    manager: ApplicationGlobalStateManager
}

const appStateContext: AppStateContext = {
    manager: new ApplicationGlobalStateManagerImpl()
}

type NotificationContext = {
    manager: NotificationManager
}

const notificationContext: NotificationContext = {
    manager: new BasicNotificationManager()
}

type ApiServiceContext = {
    person: PersonApiService,
    jurPerson: JurPersonApiService,
    user: UserApiService
    webArch: WebArchContext
}

type WebArchContext = {
    general: GeneralWebArchiver,
    wayBack: WayBackMachineArchiver
}

export type ServiceContext = {
    auth: AuthContext,
    api: ApiServiceContext,
    hierarchyPermissionsChecker: HierarchyPermissionChecker,
    exploration: ExplorationContext,
    creation: CreationContext,
    appGlobalState: AppStateContext,
    applicationResources: ApplicationResourcesContext,
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
    map: {
        mapPainter: MapPainter,
        personMapTool: PersonMapTool,
        jurPersonMapTool: JurPersonMapTool,
        mapUtil: MapUtil
    },
    validation: {
        link: LinkValidator
    }
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

const mapPainter = new MapPainterImpl();

const mapUtil = new BasicMapUtil(mapPainter);

const ripeJurPersonUtil = new BasicRipeJurPersonUtil(ripePersonRelationshipsUtil);


const apiServiceContext: ApiServiceContext = {
    person: new PersonApiServiceImpl(explorationContext.apiService.person, creationContext.apiService.person),
    jurPerson: new JurPersonApiServiceImpl(explorationContext.apiService.jurPerson, creationContext.apiService.jurPerson),
    user: new UserApiServiceImpl(explorationContext.apiService.user, creationContext.apiService.user),
    webArch: webArchContext
}

const serviceContext: ServiceContext = {
    api: apiServiceContext,
    auth: authContext,
    applicationResources: applicationResourcesContext,
    hierarchyPermissionsChecker: new BasicHierarchyPermissionsChecker(),
    exploration: explorationContext,
    creation: creationContext,
    appGlobalState: appStateContext,
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
        ripeJurPersonUtil: ripeJurPersonUtil,
        jurPersonProcessor: new BasicJurPersonProcessor(personRelationshipsBinder, mappers.jurPerson)
    },
    map: {
        mapPainter: mapPainter,
        mapUtil: mapUtil,
        personMapTool: new BasicPersonMapTool(mapUtil, mapPainter, ripePersonRelationshipsUtil),
        jurPersonMapTool: new BasicJurPersonMapTool(mapUtil, mapPainter, ripeJurPersonUtil)
    },
    validation: {
        link: new SimpleLinkValidator()
    }
}

export default serviceContext;