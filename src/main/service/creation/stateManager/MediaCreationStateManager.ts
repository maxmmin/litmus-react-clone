import CreationStateManager from "./CreationStateManager";
import Media from "../../../model/Media";

export default interface MediaEntityCreationStateManager<E,V=E> extends CreationStateManager<E,V>{
    setMedia(media: Media): void;
    getMedia(): Media;
    setMainImage(imageKey: string|null): void;
    clearMedia(): void;
}