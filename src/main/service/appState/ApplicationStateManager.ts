interface ApplicationStateManager {
    enablePending (): void;
    disablePending (): void;
    enableSecuredImgHandling(): void;
    disableSecuredImgHandling(): void;
    isSecuredImgHandling(): boolean;
    isPending(): boolean;
    isMenuOpened(): boolean;
    headerMenuToggle (): void;
    headerMenuClose (): void;
}

export default ApplicationStateManager;