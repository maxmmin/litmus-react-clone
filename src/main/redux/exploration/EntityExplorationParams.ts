import ExplorationMode from "./ExplorationMode";

export default interface EntityExplorationParams {
    mode: ExplorationMode;
    i: number;
    id: string | null;
    supportedModes: ExplorationMode[];
}