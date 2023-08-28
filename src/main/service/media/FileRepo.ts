export default interface FileRepo {
    getFile(name: string): File|null;
    getFileOrThrow(name: string): File;
    getFiles(): Array<File>;
    saveFile(file: File): string;
    removeFile(name: string): boolean;
}