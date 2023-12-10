export default interface SourceInEntityStateManager {
    getSources(): string[];
    setSources(sources: string[]): void;
    appendSource(source: string): number;
    removeSource(source: string): number;
}