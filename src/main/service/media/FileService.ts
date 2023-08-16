interface FileService {
    uploadFile(file: File): string;
    removeFile(url: string): void;
}