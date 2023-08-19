import Media from "../../model/Media";

export default function (media: Media): string[] {
    const files: string[] = []
    files.push(...media.images);
    return files;
}