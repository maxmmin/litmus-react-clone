class FileServiceImpl implements FileService {
    uploadFile(file: File): string {
        return window.URL.createObjectURL(file);
    }

    removeFile(url: string): void {
        window.URL.revokeObjectURL(url);
    }

}