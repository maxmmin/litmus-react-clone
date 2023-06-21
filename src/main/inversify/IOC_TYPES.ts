const IOC_TYPES = {
    Store: Symbol("store"),

    auth: {
        AuthApiService: Symbol("AuthApiService"),
        AuthStateManager: Symbol("AuthenticationStateManager"),
        AuthManager: Symbol("AuthenticationManager")
    },

    mappers: {
        PersonDtoMapper: Symbol("PersonMapper"),
        JurPersonDtoMapper: Symbol("JurPersonMapper"),
        UserDtoMapper: Symbol("UserMapper")
    },

    creation: {
        apiServices: {
            JurPersonCreationApiService: Symbol("JurPersonCreationApiService"),
            PersonCreationApiService: Symbol("PersonCreationApiService"),
            UserCreationApiService: Symbol("UserCreationApiService")
        },
        stateManagers: {
            JurPersonCreationStateManager: Symbol("JurPersonCreationStateManager"),
            UserCreationStateManager: Symbol("UserCreationStateManager"),
            PersonCreationStateManager: Symbol("PersonCreationStateManager")
        },
        typedActions: {
            PersonCreationTypedAction: Symbol("PersonCreationTypedAction"),
            JurPersonCreationTypedAction: Symbol("JurPersonCreationTypedAction"),
            UserCreationTypedAction: Symbol("UserCreationTypedAction")
        },

        PersonCreationService: Symbol("PersonCreationService"),
        UserCreationService: Symbol("UserCreationService"),
        JurPersonCreationService: Symbol("JurPersonCreationService")
    },

    exploration: {
        apiServices: {
            PersonExplorationApiService: Symbol("PersonExplorationApiService"),
            UserExplorationApiService: Symbol("UserExplorationApiService"),
            JurPersonExplorationApiService: Symbol("JurPersonExplorationApiService"),
        },

        stateManagers: {
            UserExplorationStateManager: Symbol("UserExplorationStateManager"),
            PersonExplorationStateManager: Symbol("PersonExplorationStateManager"),
            JurPersonExplorationStateManager: Symbol("JurPersonExplorationStateManager")
        },

        typedActions: {
            PersonExplorationTypedAction: Symbol("PersonExplorationTypedAction"),
            UserExplorationTypedAction: Symbol("UserExplorationTypedAction"),
            JurPersonExplorationTypedAction: Symbol("JurPersonExplorationTypedAction")
        },

        UserExplorationService: Symbol("UserExplorationService"),
        PersonExplorationService: Symbol("PersonExplorationService"),
        JurPersonExplorationService: Symbol("JurPersonExplorationService")
    },

    userIdentity: {
        UserIdentityApiService: Symbol("UserIdentityApiService"),
        UserIdentityManager: Symbol("UserIdentityManager")
    },

    TimersStateManager: Symbol("TimersStateManager"),

    NotificationsManager: Symbol("NotificationsManager"),
}

export default IOC_TYPES;