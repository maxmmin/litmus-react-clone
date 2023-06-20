import {Container} from "inversify";
import AuthApiService from "../service/auth/api/AuthApiService";
import IOC_TYPES from "./IOC_TYPES";
import BasicAuthApiService from "../service/auth/api/BasicAuthApiService";
import AuthenticationStateManager from "../service/auth/stateManager/AuthenticationStateManager";
import AuthenticationStateManagerImpl from "../service/auth/stateManager/AuthenticationStateManagerImpl";
import Store from "../redux/store";
import AuthenticationManager from "../service/auth/AuthenticationManager";
import BasicAuthenticationManager from "../service/auth/BasicAuthenticationManager";
import DtoMapper from "../rest/dto/dtoMappers/DtoMapper";
import PersonRequestDto from "../rest/dto/person/PersonRequestDto";
import Person from "../model/human/person/Person";
import PersonResponseDto from "../rest/dto/person/PersonResponseDto";
import PersonDtoMapper from "../rest/dto/dtoMappers/PersonDtoMapper";
import JurPersonRequestDto from "../rest/dto/jurPerson/JurPersonRequestDto";
import {JurPerson} from "../model/jurPerson/JurPerson";
import JurPersonResponseDto from "../rest/dto/jurPerson/JurPersonResponseDto";
import JurPersonDtoMapper from "../rest/dto/dtoMappers/JurPersonDtoMapper";
import UserRequestDto from "../rest/dto/user/UserRequestDto";
import User from "../model/human/user/User";
import UserResponseDto from "../rest/dto/user/UserResponseDto";
import UserDtoMapper from "../rest/dto/dtoMappers/UserDtoMapper";
import CreationService from "../service/creation/CreationService";
import CreationApiService from "../service/creation/api/CreationApiService";
import PersonCreationApiService from "../service/creation/api/PersonCreationApiService";
import UserCreationApiService from "../service/creation/api/UserCreationApiService";
import JurPersonCreationApiService from "../service/creation/api/JurPersonCreationApiService";
import CreationStateManager from "../service/creation/stateManager/CreationStateManager";
import EntityCreationState from "../redux/types/creation/EntityCreationState";
import PersonCreationStateManager from "../service/creation/stateManager/person/PersonCreationStateManager";
import PersonCreationStateManagerImpl from "../service/creation/stateManager/person/PersonCreationStateManagerImpl";
import JurPersonCreationStateManagerImpl
    from "../service/creation/stateManager/jurPerson/JurPersonCreationStateManagerImpl";
import JurPersonCreationStateManager from "../service/creation/stateManager/jurPerson/JurPersonCreationStateManager";
import UserCreationStateManager from "../service/creation/stateManager/user/UserCreationStateManager";
import UserCreationStateManagerImpl from "../service/creation/stateManager/user/UserCreationStateManagerImpl";
import PersonCreationService from "../service/creation/PersonCreationService";
import JurPersonCreationService from "../service/creation/JurPersonCreationService";
import UserCreationService from "../service/creation/UserCreationService";
import TimersStateManager from "../service/timers/TimersStateManager";
import {BasicNotificationManager, NotificationManager} from "../redux/types/applicationState/Notification";
import store from "../redux/store";
import CreationTypedAction from "../redux/actions/CreationTypedAction";

const container = new Container();

container.bind<typeof Store>(IOC_TYPES.Store).toConstantValue(store)

container.bind<AuthApiService>(IOC_TYPES.AuthApiService).to(BasicAuthApiService)
container.bind<AuthenticationStateManager>(IOC_TYPES.AuthStateManager).to(AuthenticationStateManagerImpl)
container.bind<AuthenticationManager>(IOC_TYPES.AuthManager).to(BasicAuthenticationManager)

container.bind<CreationApiService<PersonRequestDto, PersonResponseDto>>(IOC_TYPES.PersonCreationApiService).to(PersonCreationApiService);
container.bind<CreationApiService<UserRequestDto, UserResponseDto>>(IOC_TYPES.UserCreationApiService).to(UserCreationApiService);
container.bind<CreationApiService<JurPersonRequestDto, JurPersonResponseDto>>(IOC_TYPES.JurPersonCreationApiService).to(JurPersonCreationApiService);

container.bind<DtoMapper<PersonRequestDto, Person, PersonResponseDto>>(IOC_TYPES.PersonDtoMapper).to(PersonDtoMapper);
container.bind<DtoMapper<JurPersonRequestDto, JurPerson, JurPersonResponseDto>>(IOC_TYPES.JurPersonDtoMapper).to(JurPersonDtoMapper);
container.bind<DtoMapper<UserRequestDto, User, UserResponseDto>>(IOC_TYPES.UserDtoMapper).to(UserDtoMapper);

container.bind<PersonCreationStateManager>(IOC_TYPES.PersonCreationStateManager).to(PersonCreationStateManagerImpl)
container.bind<JurPersonCreationStateManager>(IOC_TYPES.JurPersonCreationStateManager).to(JurPersonCreationStateManagerImpl);
container.bind<UserCreationStateManager>(IOC_TYPES.UserCreationStateManager).to(UserCreationStateManagerImpl);

container.bind<CreationService<Person>>(IOC_TYPES.PersonCreationService).to(PersonCreationService);
container.bind<CreationService<JurPerson>>(IOC_TYPES.JurPersonCreationService).to(JurPersonCreationService)
container.bind<CreationService<User>>(IOC_TYPES.UserCreationService).to(UserCreationService);

container.bind<CreationTypedAction>(IOC_TYPES.JurPersonCreationTypedAction).toConstantValue(CreationTypedAction.jurPerson)
container.bind<CreationTypedAction>(IOC_TYPES.PersonCreationTypedAction).toConstantValue(CreationTypedAction.person);
container.bind<CreationTypedAction>(IOC_TYPES.UserCreationTypedAction).toConstantValue(CreationTypedAction.user)

container.bind<TimersStateManager>(IOC_TYPES.TimersStateManager).to(TimersStateManager);
container.bind<NotificationManager>(IOC_TYPES.NotificationsManager).to(BasicNotificationManager);

export default container;
