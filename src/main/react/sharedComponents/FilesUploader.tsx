import React from "react";
import "../assets/styles/imageUploader.scss";
import {BasicHttpError, HttpErrorParser} from "../../error/BasicHttpError";
import MimeMatcher, {matcher} from "mime-matcher";

type UploaderProps = {
    uploadFile: (file: File)=>string,
    cssAnchor?: string,
    allowedTypes: string[]|null,
    uploadErrorHandler?: (error: unknown)=>void
    accept?: string
}

const defaultErrHandler = (e: unknown) => {
    const error = HttpErrorParser.parseError(e);
    console.error(error);
}

export default function FilesUploader ({uploadFile, uploadErrorHandler=defaultErrHandler, allowedTypes, cssAnchor = "", accept}: UploaderProps) {
    function upload (file: File) {
        if (allowedTypes&&!new MimeMatcher(...allowedTypes).match(file.type)) throw new Error("Cannot upload file: invalid extension "+file.type)
        uploadFile(file);
    }

    return (
        <div className={`files-uploader-wrapper ${cssAnchor}`}>
            <input type={"file"} accept={accept} className={"file form-control"} multiple={true}
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