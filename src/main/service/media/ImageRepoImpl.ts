import ImageRepo from "./ImageRepo";
import FileRepoFactory from "./FileRepoFactory";
import FileRepo from "./FileRepo";

export default class ImageRepoImpl implements ImageRepo {
    public static allowedImageTypes: string[] = ["image/jpeg", "image/png"]

    readonly fileService: FileRepo;


    constructor(fileService: FileRepo) {
        this.fileService = fileService;
    }

    static getInstance(fileService: FileRepo = FileRepoFactory.getGlobalFileService()) {
        return new ImageRepoImpl(fileService);
    }

    saveImage(file: File): string {
        if (ImageRepoImpl.allowedImageTypes.includes(file.type)) {
            return this.fileService.saveFile(file);
        }   else throw new Error("unexpected type")
    }

}