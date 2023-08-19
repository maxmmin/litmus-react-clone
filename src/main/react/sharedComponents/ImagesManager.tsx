import React from "react";
import FilesUploader from "./FilesUploader";
import FileProps from "../../model/FileProps";

type ImageManagerProps = {
    mainImage: FileProps|null,
    images: FileProps[],
    uploadImage: (file: File)=>string,
    removeImage: (fileKey: string)=>boolean,
    cssAnchor?: string,
    selectAsMain: (fileKey: string)=>void;
}

type ImageProps = {
    image: FileProps,
    remove: (fileKey: string)=>boolean,
    selectAsMain: (fileKey: string)=>void,
    cssAnchor?: string
}

export function ImageComponent ({image, cssAnchor = "", remove, selectAsMain}: ImageProps) {
    return (
        <div className={`file form-control ${cssAnchor}`}>{image.file.name}</div>
    )
}

export default function ImagesManager ({images, mainImage, selectAsMain, uploadImage, removeImage, cssAnchor=""}: ImageManagerProps) {
    return (
        <div className={`images-manager-wrapper ${cssAnchor}`}>
            <FilesUploader uploadFile={uploadImage} allowedTypes={null}/>

            {images.map(imageProps => <ImageComponent
                                                    key={imageProps.fileKey}
                                                    image={imageProps}
                                                    remove={()=>removeImage(imageProps.fileKey)}
                                                    selectAsMain={()=>selectAsMain(imageProps.fileKey)}
                                                />
            )}
        </div>
    )
}