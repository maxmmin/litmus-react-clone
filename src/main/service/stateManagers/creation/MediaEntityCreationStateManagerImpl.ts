import MediaEntityCreationStateManager from "./MediaCreationStateManager";
import MediaEntity from "../../../model/MediaEntity";
import CreationStateManagerImpl from "./CreationStateManagerImpl";
import Media from "../../../model/Media";

export default class MediaEntityCreationStateManagerImpl<E,C extends MediaEntity,V=E> extends CreationStateManagerImpl<E, C, V> implements MediaEntityCreationStateManager<E,C,V> {
    getMedia(): Media {
        return this.getCreationParams().media;
    }

    appendImage(imageKey: string): void {
        const currentImages = this.getMedia().images;
        this.setImages([...currentImages,imageKey])
    }

    setImages(imageKeys: string[]): void {
        const currentMedia = this.getMedia();

        const newMedia: Media = {...currentMedia, images: imageKeys}

        this.setMedia(newMedia);
    }

    setMainImage(imageKey: string | null): void {
        const currentMedia = this.getMedia();

        const newMedia: Media = {...currentMedia, mainImage: imageKey};

        this.setMedia(newMedia);
    }

    setMedia(media: Media): void {
        this.updateEntityCreationParams({media: media} as Partial<C>)
    }

    clearMedia(): void {
        const defaultMedia: Media = {mainImage: null, images: []};
        this.updateEntityCreationParams({media: defaultMedia} as Partial<C>)
    }

}