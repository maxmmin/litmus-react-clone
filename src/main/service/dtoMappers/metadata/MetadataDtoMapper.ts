import Mapper from "../Mapper";
import {MetadataResponseDto} from "../../../rest/dto/MetadataContainableResponseDto";
import {Metadata} from "../../../model/MetadataContainable";

export default interface MetadataDtoMapper extends  Mapper<MetadataResponseDto, Metadata> {
}