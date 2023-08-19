import React from "react";
import FilesUploader from "./FilesUploader";
import FileProps from "../../model/FileProps";

type ImageManagerProps = {
    mainImage: FileProps|null,
    images: FileProps[],
    uploadImage: (file: File)=>string,
    removeImage: (fileKey: string)=>boolean,
    cssAnchor?: string
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

export default function ImagesManager ({images, mainImage, uploadImage, removeImage, cssAnchor=""}: ImageManagerProps) {
    return (
        <div className={`images-manager-wrapper ${cssAnchor}`}>
            <FilesUploader uploadFile={uploadImage} allowedTypes={null}/>

            {images.map(image => <ImageComponent image={image} remove={()=>true} selectAsMain={()=>{}}/>)}
        </div>
    )
}