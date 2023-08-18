import FileServiceImpl from "./FileServiceImpl";

export default class FileServiceFactory {
    private static readonly fileService: FileService = new FileServiceImpl();
    static getGlobalFileService () {
        return FileServiceFactory.fileService;
    }
}