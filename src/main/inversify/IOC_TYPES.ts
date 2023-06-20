const IOC_TYPES = {
    Store: Symbol("store"),
    AuthApiService: Symbol("AuthApiService"),
    AuthStateManager: Symbol("AuthenticationStateManager"),
    AuthManager: Symbol("AuthenticationManager"),

    PersonDtoMapper: Symbol("PersonMapper"),
    JurPersonDtoMapper: Symbol("JurPersonMapper"),
    UserDtoMapper: Symbol("UserMapper"),

    JurPersonCreationApiService: Symbol("JurPersonCreationApiService"),
    PersonCreationApiService: Symbol("PersonCreationApiService"),
    UserCreationApiService: Symbol("UserCreationApiService"),

    JurPersonCreationStateManager: Symbol("JurPersonCreationStateManager"),
    UserCreationStateManager: Symbol("UserCreationStateManager"),
    PersonCreationStateManager: Symbol("PersonCreationStateManager"),

    PersonCreationService: Symbol("PersonCreationService"),
    JurPersonCreationService: Symbol("JurPersonCreationService"),
    UserCreationService: Symbol("UserCreationService"),

    TimersStateManager: Symbol("TimersStateManager"),

    NotificationsManager: Symbol("NotificationsManager"),

    PersonCreationTypedAction: Symbol("PersonCreationTypedAction"),
    JurPersonCreationTypedAction: Symbol("JurPersonCreationTypedAction"),
    UserCreationTypedAction: Symbol("UserCreationTypedAction"),

    ExplorationApiService: Symbol("ExplorationApiService"),
    ExplorationStateManager: Symbol("ExplorationStateManager"),
    ExplorationService: Symbol("ExplorationService"),
    // @todo timers state manager
    UserIdentityApiService: Symbol("UserIdentityApiService"),
    UserIdentityManager: Symbol("UserIdentityManager")
}

export default IOC_TYPES;