import React from "react";
import FilesUploader from "./FilesUploader";
import FileProps from "../../model/FileProps";
import {PersonIcon, TrashIcon} from "../assets/icons";
import ImageRepoImpl from "../../service/media/ImageRepoImpl";
import InputError from "./InputError";
import '../assets/styles/imageUploader.scss'

type ImageManagerProps = {
    mainImageKey: string|null,
    images: FileProps[],
    clearMainImage: ()=>void,
    uploadImage: (file: File)=>string,
    removeImage: (fileKey: string)=>boolean,
    cssAnchor?: string,
    selectAsMain: (fileKey: string)=>void;
    uploadErrorHandler?: (e: unknown)=>void;
}

type ImageComponentProps = {
    image: FileProps,
    remove: (fileKey: string)=>boolean,
    selectAsMain: (fileKey: string)=>void,
    cssAnchor?: string
}

export function ImageComponent ({image, cssAnchor = "", remove, selectAsMain}: ImageComponentProps) {
    return (
        <div className={`form-control uploaded-image ${image.error ? 'is-invalid': ''} ${cssAnchor}`}>
            <div className="uploaded-image__info no-scrollbar">{image.file.name}</div>
            <div className="uploaded-image__actions-block">
                <div className="uploaded-image__action uploaded-image__action_set-main-wrapper"
                    onClick={e=>selectAsMain(image.fileKey)}
                ><PersonIcon className={"uploaded-image__action-icon"} color={"black"}/></div>
                <div className="uploaded-image__action uploaded-image__action_remove-wrapper"
                    onClick={e => remove(image.fileKey)}
                ><TrashIcon className={"uploaded-image__action-icon"} color={"black"}/></div>
            </div>
        </div>
    )
}

export default function ImagesManager ({images, uploadErrorHandler, mainImageKey, clearMainImage,
                                           selectAsMain, uploadImage, removeImage, cssAnchor=""}: ImageManagerProps) {

    const hasImages = images.length>0;

    function isMain (imageKey: string) {
        return imageKey===mainImageKey;
    }

    return (
        <div className={`images-manager-wrapper ${cssAnchor}`}>
            <FilesUploader uploadErrorHandler={uploadErrorHandler} uploadFile={uploadImage} accept={"image/*"} allowedTypes={ImageRepoImpl.allowedImageTypes}/>

            {hasImages &&
                    <div className={"uploaded-images-section"}>
                        {images.map(imageProps => <div key={imageProps.fileKey} className={`uploaded-image-wrapper ${isMain(imageProps.fileKey)?"main":""}`}>
                                <>
                                    {isMain(imageProps.fileKey) && <label className={"uploaded-image-wrapper__main-photo-label"}>Головне фото:</label>}
                                    <InputError cssAnchor={"m-0"} error={imageProps.error}/>
                                    <ImageComponent
                                        image={imageProps}
                                        remove={removeImage}
                                        selectAsMain={isMain(imageProps.fileKey)?clearMainImage:selectAsMain}
                                        cssAnchor={isMain(imageProps.fileKey)?"main":undefined}
                                    />
                                </>
                            </div>
                        )}
                    </div>
            }
        </div>
    )
}