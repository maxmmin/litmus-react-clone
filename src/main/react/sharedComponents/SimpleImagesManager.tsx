import FileProps from "../../model/FileProps";
import ImageStateManager from "../../service/media/ImageStateManager";
import React, {useContext} from "react";
import {LitmusServiceContext} from "../App";
import ImagesManager from "./ImagesManager";
import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";

type Props = {
    mainImageKey: string|null,
    images: FileProps[],
    imageStateManager: ImageStateManager,
    cssAnchor?: string
}

export default function SimpleImagesManager ({mainImageKey, images, imageStateManager, cssAnchor = ""}: Props) {

    const litmusContext = useContext(LitmusServiceContext);

    const fileService = litmusContext.files.fileService;

    const imageService = litmusContext.files.imageService;

    const notificationManager = litmusContext.notification.manager;

    function handleUploadError(e: unknown) {
        const error = HttpErrorParser.parseError(e);
        notificationManager.error(error.error);
    }

    return (
        <ImagesManager
            mainImageKey={mainImageKey}
            images={images}
            cssAnchor={cssAnchor}

            uploadImage={file=>{
                const fileKey = imageService.saveImage(file);
                imageStateManager.appendImage(fileKey);
                return fileKey;
            }}

            removeImage={(fileKey: string): boolean => {
                const wasFileDeleted = fileService.removeFile(fileKey);

                const updatedImagesKeys = images.map(imageProps=>imageProps.fileKey);
                const fileKeyIndex = updatedImagesKeys.indexOf(fileKey);

                if (fileKeyIndex>-1) {
                    updatedImagesKeys.splice(fileKeyIndex, 1);
                } else throw new Error("no image key found in redux state");

                imageStateManager.setImages(updatedImagesKeys);

                if (fileKey===mainImageKey) imageStateManager.setMainImage(null);

                return wasFileDeleted;
            }}

            clearMainImage={()=>imageStateManager.setMainImage(null)}

            selectAsMain={(fileKey: string): void => {
                const currentImages = images.map(imageProps=>imageProps.fileKey);

                const fileKeyIndex = currentImages.indexOf(fileKey);

                if (fileKeyIndex===-1) {
                    throw new Error("no image key found in redux state");
                }

                imageStateManager.setMainImage(fileKey);
            }}

            uploadErrorHandler={handleUploadError}

        />
    )
}