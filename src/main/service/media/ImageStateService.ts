export default interface ImageStateService {
    setImages(keyList: string[]): void;
    setMainImage(imageKey: string|null): void;
}