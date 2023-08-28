import FileRepoImpl from "./FileRepoImpl";
import FileRepo from "./FileRepo";

export default class FileRepoFactory {
    private static readonly fileRepo: FileRepo = new FileRepoImpl();
    static getGlobalFileService () {
        return FileRepoFactory.fileRepo;
    }
}