import SourceValidationObject from "../../validation/validationModels/SourceValidationObject";

export default interface SourceContainableEntityStateManager {
    getSources(): string[];
    setSources(sources: string[]): void;
    appendSource(source: string): number;
    removeSource(source: string): number;
    getValidationSourcesErrors(): SourceValidationObject[];
    setValidationSourcesErrors(validationErrors: SourceValidationObject[]): void;
}