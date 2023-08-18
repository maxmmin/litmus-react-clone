import Media from "../../../../model/Media";
import MediaEntityFormDataBuilder from "./MediaEntityFormDataBuilder";
import FileServiceFactory from "../../../media/FileServiceFactory";

export default class MediaEntityFormDataBuilderImpl implements MediaEntityFormDataBuilder{
    private readonly fileService: FileService;

    public static getInstance (fileService: FileService = FileServiceFactory.getGlobalFileService()) {
        return new MediaEntityFormDataBuilderImpl(fileService);
    }

    constructor(fileService: FileService) {
        this.fileService = fileService;
    }

     buildFormData(entityRequestDto: object, media: Media|null): FormData {
        const formData = new FormData();
        formData.set("entity", JSON.stringify(entityRequestDto));
        if (media) {
            if (media.mainImage!==null) {
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