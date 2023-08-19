import React from "react";
import "../../css/imageUploader.scss";

type UploaderProps = {
    uploadFile: (file: File)=>string,
    cssAnchor?: string,
    allowedTypes: string[]|null
}

export default function FilesUploader ({uploadFile, allowedTypes, cssAnchor = ""}: UploaderProps) {
    function upload (file: File) {
        if (allowedTypes&&!allowedTypes.includes(file.type)) throw new Error("cannot upload file. invalid extension")
        uploadFile(file);
    }

    return (
        <div className={`files-uploader-wrapper ${cssAnchor}`}>
            <input type={"file"} className={"file form-control"}
                   multiple={true}
               onChange={e=>{
                   const files = e.currentTarget.files;
                   if (files) Array.from(files).forEach(upload);
                   e.currentTarget.value="";
               }}
            />
        </div>)
}