import CreationStateManager from "./CreationStateManager";
import Media from "../../../model/Media";

export default interface MediaEntityCreationStateManager<E,C=E,V=E> extends CreationStateManager<E,C,V>{
    setMedia(media: Media): void;
    appendImage(imageKey: string): void;
    getMedia(): Media;
    setMainImage(imageKey: string|null): void;
    setImages(imageKeys: string[]): void;
    clearMedia(): void;
}