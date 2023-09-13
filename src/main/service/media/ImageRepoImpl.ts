import ImageRepo from "./ImageRepo";
import FileRepoFactory from "./FileRepoFactory";
import FileRepo from "./FileRepo";
import MimeMatcher from "mime-matcher";

export default class ImageRepoImpl implements ImageRepo {
    public static allowedImageTypes: string[] = ["image/*"]

    public static isAllowed(mime: string): boolean {
        const m = new MimeMatcher(...this.allowedImageTypes);
        return m.match(mime);
    }

    readonly fileService: FileRepo;


    constructor(fileService: FileRepo) {
        this.fileService = fileService;
    }

    static getInstance(fileService: FileRepo = FileRepoFactory.getGlobalFileService()) {
        return new ImageRepoImpl(fileService);
    }

    saveImage(file: File): string {
        if (ImageRepoImpl.isAllowed(file.type)) {
            return this.fileService.saveFile(file);
        }   else throw new Error("unexpected type: "+file.type)
    }

}