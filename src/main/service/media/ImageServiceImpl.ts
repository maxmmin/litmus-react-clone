import ImageService from "./ImageService";
import FileServiceFactory from "./FileServiceFactory";

export default class ImageServiceImpl implements ImageService {
    public static allowedImageTypes: string[] = ["image/jpeg", "image/png"]

    readonly fileService: FileService;


    constructor(fileService: FileService) {
        this.fileService = fileService;
    }

    static getInstance(fileService: FileService = FileServiceFactory.getGlobalFileService()) {
        return new ImageServiceImpl(fileService);
    }

    saveImage(file: File): string {
        if (ImageServiceImpl.allowedImageTypes.includes(file.type)) {
            return this.fileService.saveFile(file);
        }   else throw new Error("unexpected type")
    }

}