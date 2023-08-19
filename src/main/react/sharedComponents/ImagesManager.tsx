import React from "react";
import FilesUploader from "./FilesUploader";
import FileProps from "../../model/FileProps";
import {PersonIcon, TrashIcon} from "../../util/icons";

type ImageManagerProps = {
    mainImage: FileProps|null,
    images: FileProps[],
    uploadImage: (file: File)=>string,
    removeImage: (fileKey: string)=>boolean,
    cssAnchor?: string,
    selectAsMain: (fileKey: string)=>void;
}

type ImageComponentProps = {
    image: FileProps,
    remove: (fileKey: string)=>boolean,
    selectAsMain: (fileKey: string)=>void,
    cssAnchor?: string
}

export function ImageComponent ({image, cssAnchor = "", remove, selectAsMain}: ImageComponentProps) {
    return (
        <div className={`uploaded-image form-control ${cssAnchor}`}>
            <div className="uploaded-image__info">{image.file.name}</div>
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

export default function ImagesManager ({images, mainImage, selectAsMain, uploadImage, removeImage, cssAnchor=""}: ImageManagerProps) {
    return (
        <div className={`images-manager-wrapper ${cssAnchor}`}>
            <FilesUploader uploadFile={uploadImage} allowedTypes={null}/>

            {images.map(imageProps => <ImageComponent
                                                    key={imageProps.fileKey}
                                                    image={imageProps}
                                                    remove={removeImage}
                                                    selectAsMain={selectAsMain}
                                                />
            )}
        </div>
    )
}