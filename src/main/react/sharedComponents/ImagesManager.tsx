import React from "react";
import FilesUploader from "./FilesUploader";

type ImageManagerProps = {
    mainImage: File|null,
    images: File[],
    uploadImage: (file: File)=>string,
    removeImage: ()=>boolean,
    cssAnchor: string
}

type FileProps = {
    image: File,
    remove: ()=>boolean,
    selectAsMain: ()=>void,
    cssAnchor?: string
}

export function ImageComponent ({image, cssAnchor = "", remove, selectAsMain}: FileProps) {
    return (
        <div className={`file form-control ${cssAnchor}`}>{image.name}</div>
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