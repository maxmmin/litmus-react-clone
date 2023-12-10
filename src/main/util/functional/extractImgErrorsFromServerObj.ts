import getArrayValidationKeyI from "./getArrayValidationKeyI";
import {checkNotEmpty} from "../pureFunctions";
import {ImageValidationObject} from "../../rest/dto/ImageValidationObject";
import Media from "../../model/Media";
import {ServerMediaContainableValidationObject} from "../../rest/dto/ServerMediaContainableValidationObject";

export default function extractImgErrorsFromServerObj
    (model: {media: Media},serverValidationObject: ServerMediaContainableValidationObject): ImageValidationObject[] {
    const serverValidationKeys = Object.keys(serverValidationObject);
    const imgErrors = serverValidationKeys.filter(r=>r.startsWith("media.img"))

    const images: ImageValidationObject[] = []

    imgErrors
        .forEach(key => {
            const index = getArrayValidationKeyI(key);
            if (index !== null) {
                const img = checkNotEmpty(model.media.images[index]);
                const message = serverValidationObject[key];

                const validationObject: ImageValidationObject = {
                    imageKey: img,
                    message: message
                }

                images.push(validationObject);
            }
        })

    if (serverValidationObject["media.mainImg"]) {
        images.push({imageKey: checkNotEmpty(model.media.mainImage), message: serverValidationObject["media.mainImg"]})
    }

    return images;
}