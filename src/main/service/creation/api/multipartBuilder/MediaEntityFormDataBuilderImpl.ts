import Media from "../../../../model/Media";
import MediaEntityFormDataBuilder from "./MediaEntityFormDataBuilder";
import FileRepoFactory from "../../../media/FileRepoFactory";
import {ContentType} from "../../../../util/apiRequest/ApiRequestManager";
import FileRepo from "../../../media/FileRepo";

export default class MediaEntityFormDataBuilderImpl implements MediaEntityFormDataBuilder{
    private readonly fileService: FileRepo;

    public static getInstance (fileService: FileRepo = FileRepoFactory.getGlobalFileService()) {
        return new MediaEntityFormDataBuilderImpl(fileService);
    }

    constructor(fileService: FileRepo) {
        this.fileService = fileService;
    }

     buildFormData(entityRequestDto: object, media: Media|null): FormData {
        const formData = new FormData();
        const entityBlob = new Blob([JSON.stringify(entityRequestDto)], {type: ContentType.JSON})
        formData.set("entity", entityBlob);
        if (media) {
            if (media.mainImage!==null) {
                const mainImage: File = this.fileService.getFileOrThrow(media.mainImage);
                formData.set('mainImg', mainImage);
            }


            for (let counter = 0; counter<media.images.length; counter++) {
                const imageKey = media.images[counter];

                if (imageKey===media.mainImage) continue;
                const image: File = this.fileService.getFileOrThrow(imageKey);
                formData.append('img', image);
            }
        }

        return formData;
    }
}