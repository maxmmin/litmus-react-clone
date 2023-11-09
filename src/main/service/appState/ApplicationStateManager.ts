interface ApplicationStateManager {
    enablePending (): void;
    disablePending (): void;
    headerMenuToggle (): void;
    headerMenuClose (): void;
}

export default ApplicationStateManager;