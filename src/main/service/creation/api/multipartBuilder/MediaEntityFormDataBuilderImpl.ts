import Media from "../../../../model/Media";
import MediaEntityFormDataBuilder from "./MediaEntityFormDataBuilder";

export default class MediaEntityFormDataBuilderImpl implements MediaEntityFormDataBuilder{
    private readonly fileService: FileService;


    constructor(fileService: FileService) {
        this.fileService = fileService;
    }

     buildFormData(entityRequestDto: object, media: Media|null): FormData {
        const formData = new FormData();
        formData.set("entity", JSON.stringify(entityRequestDto));
        if (media) {
            if (media.mainImage) {
                const mainImage: File = this.fileService.getFileOrThrow(media.mainImage);
                formData.set('mainImg', mainImage);
            }

            for (let counter = 0; counter<media.images.length; counter++) {
                const imageKey = media.images[counter];
                const image: File = this.fileService.getFileOrThrow(imageKey);
                formData.set('img', image);
            }
        }
        return formData;
    }
}