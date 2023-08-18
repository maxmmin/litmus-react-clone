import MediaEntityCreationStateManager from "./MediaCreationStateManager";
import MediaEntity from "../../../model/MediaEntity";
import CreationStateManagerImpl from "./CreationStateManagerImpl";
import Media from "../../../model/Media";

export default class MediaEntityCreationStateManagerImpl<E extends MediaEntity,V=E> extends CreationStateManagerImpl<E, V> implements MediaEntityCreationStateManager<E,V> {
    getMedia(): Media {
        return this.getCreationParams().media;
    }

    setMainImage(imageKey: string | null): void {
        const currentMedia = this.getMedia();
        const newMedia: Media = {mainImage: currentMedia.mainImage, images: [...currentMedia.images]}

        if (imageKey!==null) {
            const imageIndex = newMedia.images.indexOf(imageKey);
            if (imageIndex>-1) newMedia.images.splice(imageIndex,1);
        }
        if (newMedia.mainImage) newMedia.images.push(newMedia.mainImage);

        currentMedia.mainImage = imageKey;

    }

    setMedia(media: Media): void {
        this.updateEntityCreationParams({media: media} as Partial<E>)
    }

    clearMedia(): void {
        const defaultMedia: Media = {mainImage: null, images: []};
        this.updateEntityCreationParams({media: defaultMedia} as Partial<E>)
    }

}