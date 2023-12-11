export default interface WebPageArchiver<R> {
    archive(url: string): Promise<R>;
}