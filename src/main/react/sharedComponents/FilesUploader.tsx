import React from "react";
import "../../css/imageUploader.scss";
import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";

type UploaderProps = {
    uploadFile: (file: File)=>string,
    cssAnchor?: string,
    allowedTypes: string[]|null,
    uploadErrorHandler?: (error: unknown)=>void
}

const defaultErrHandler = (e: unknown) => {
    const error = HttpErrorParser.parseError(e);
    console.error(error);
}

export default function FilesUploader ({uploadFile, uploadErrorHandler=defaultErrHandler, allowedTypes, cssAnchor = ""}: UploaderProps) {
    function upload (file: File) {
        if (allowedTypes&&!allowedTypes.includes(file.type)) throw new Error("Cannot upload file: invalid extension")
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
                    uploadErrorHandler(e);
                  }
                  finally {
                      e.currentTarget.value="";
                  }
               }}
            />
        </div>)
}