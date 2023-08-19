import Media from "../../model/Media";

export default (media: Media) => {
    return media.mainImage&&(media.images.length>0)
}