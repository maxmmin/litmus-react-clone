import Media from "../../model/Media";

export default function hasMediaContent (media: Media): boolean {
    return media.mainImage!==null || (media.images.length>0)
}