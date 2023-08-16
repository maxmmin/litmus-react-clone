import ImageService from "./ImageService";

class ImageServiceImpl implements ImageService {
    public static allowedImageTypes: string[] = ["image/jpeg", "image/png"]

    readonly fileService: FileService;


    constructor(fileService: FileService) {
        this.fileService = fileService;
    }

    uploadImage(file: File): string {
        if (ImageServiceImpl.allowedImageTypes.includes(file.type)) {
            return this.fileService.uploadFile(file);
        }   else throw new Error("unexpected type")
    }

}