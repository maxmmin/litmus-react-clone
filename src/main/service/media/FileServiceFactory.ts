import FileRepoImpl from "./FileRepoImpl";
import FileRepo from "./FileRepo";

export default class FileServiceFactory {
    private static readonly fileRepo: FileRepo = new FileRepoImpl();
    static getGlobalFileService () {
        return FileServiceFactory.fileRepo;
    }
}