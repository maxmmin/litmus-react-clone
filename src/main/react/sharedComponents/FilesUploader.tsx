import React from "react";
import "../../css/imageUploader.scss";
import {BasicHttpError} from "../../error/BasicHttpError";

type UploaderProps = {
    uploadFile: (file: File)=>string,
    cssAnchor?: string,
    allowedTypes: string[]|null,
    handleUploadError?: (error: unknown)=>void
}

const defaultErrHandler = (e: unknown) => {
    const error = BasicHttpError.parseError(e);
    console.error(error);
}

export default function FilesUploader ({uploadFile, handleUploadError=defaultErrHandler, allowedTypes, cssAnchor = ""}: UploaderProps) {
    function upload (file: File) {
        if (allowedTypes&&!allowedTypes.includes(file.type)) throw new Error("cannot upload file. invalid extension")
        uploadFile(file);
    }

    return (
        <div className={`files-uploader-wrapper ${cssAnchor}`}>
            <input type={"file"} className={"file form-control"}
                   multiple={true}
               onChange={e=>{
                  try {
                      const files = e.currentTarget.files;
                      if (files) Array.from(files).forEach(upload);
                  } catch (e: unknown) {
                    handleUploadError(e);
                  }
                  finally {
                      e.currentTarget.value="";
                  }
               }}
            />
        </div>)
}