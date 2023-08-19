export default interface ImageStateManager {
    setImages(keyList: string[]): void;
    setMainImage(imageKey: string|null): void;
    appendImage(imageKey: string): void;
}