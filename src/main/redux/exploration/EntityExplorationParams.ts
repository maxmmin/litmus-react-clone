import ExplorationMode from "./ExplorationMode";

export default interface EntityExplorationParams {
    mode: ExplorationMode;
    id: string | null;
    supportedModes: ExplorationMode[]
}