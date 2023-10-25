import FileProps from "./FileProps";

export default interface Media {
    mainImage: string|null;
    images: Array<string>;
}

export type Images = {
    mainImage: FileProps|null,
    images: FileProps[]
}