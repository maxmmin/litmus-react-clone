import * as crypto from "crypto";

export default class FileServiceImpl implements FileService {
    private readonly files: Map<string, File> = new Map<string, File>();

    private isPresent(fileKey: string): boolean {
        return this.files.has(fileKey);
    }

    private getAvailableFileKey (baseFileName: string): string {
        let generatedName = baseFileName;

        while (this.isPresent(generatedName)) {
            generatedName = baseFileName+"_"+crypto.randomUUID();
        }

        return generatedName;
    }
    getFile(key: string): File | null {
        const file = this.files.get(key);
        return file?file:null;
    }

    getFileOrThrow(name: string): File {
        const file = this.getFile(name);
        if (file!==null) return file;
        else {
            throw new Error("such file does not exist: "+name);
        }
    }

    getFiles(): Array<File> {
        return Array.from(this.files.values());
    }

    removeFile(key: string): boolean {
        return this.files.delete(key);
    }

    saveFile(file: File): string {
        let fileKey = this.getAvailableFileKey(file.name);
        this.files.set(fileKey, file);
        return fileKey;
    }

}