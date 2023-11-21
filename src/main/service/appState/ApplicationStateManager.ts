interface ApplicationStateManager {
    enablePending (): void;
    disablePending (): void;
    isPending(): boolean;
    isMenuOpened(): boolean;
    headerMenuToggle (): void;
    headerMenuClose (): void;
}

export default ApplicationStateManager;