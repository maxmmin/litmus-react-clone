import {ImageData} from "../../model/ImageData";

export default interface ImageLoader {
    getImage(imgData: ImageData): Promise<HTMLImageElement>
}