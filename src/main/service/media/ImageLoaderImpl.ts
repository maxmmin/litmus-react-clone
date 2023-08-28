import {buildUrl} from "../../util/pureFunctions";
import appConfig from "../../config/appConfig";
import {ImageData} from "../../model/ImageData";
import ImageLoader from "./ImageLoader";

export default class ImageLoaderImpl implements ImageLoader {
    getImage(imgData: ImageData): Promise<HTMLImageElement> {
            const image = new Image();
            image.src = buildUrl(appConfig.serverMappings.mediaRoot, imgData.path);
            return new Promise<HTMLImageElement>(res=>{
                image.onload = () => res(image);
            })
    }

}