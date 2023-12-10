import FileRepo from "../../service/media/FileRepo";
import Media, {Images} from "../../model/Media";
import {ImageValidationObject} from "../../service/validation/validationModels/ImageValidationObject";

export default function getBundledImages (media: Media, fileRepo: FileRepo, validationErrs: ImageValidationObject[] = []): Images {
    return {
        mainImage: media.mainImage?{
            file: fileRepo.getFileOrThrow(media.mainImage),
            error: (validationErrs.find(i => i.fileKey === media.mainImage))?.message,
            fileKey: media.mainImage
        }:null,
        images: media.images.map(fileKey=>(
            {
                file: fileRepo.getFileOrThrow(fileKey), fileKey: fileKey,
                error: (validationErrs.find(i => i.fileKey === fileKey))?.message
            }
        ))
    }
}