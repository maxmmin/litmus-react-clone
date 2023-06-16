import EntityCreationState from "../../redux/creation/EntityCreationState";

interface CreationStateManager<S extends EntityCreationState<unknown>> {
    setEntityCreationParams(params: S["params"]): void;
    updateEntityCreationParams(params: Partial<S["params"]>): void;
}

export default CreationStateManager;