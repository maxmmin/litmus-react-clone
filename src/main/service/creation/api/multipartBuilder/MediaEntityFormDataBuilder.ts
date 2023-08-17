import Media from "../../../../model/Media";

export default interface MediaEntityFormDataBuilder {
    buildFormData(entityRequestDto: object, media: Media|null): FormData;
}