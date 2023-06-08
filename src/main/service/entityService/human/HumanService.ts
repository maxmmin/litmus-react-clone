import {FullName} from "../../exploration/FullName";
import PagedResponse from "../PagedResponse";
import {Human} from "../../../model/human/Human";
import EntityService from "../EntityService";

/**
 * E - entity can be searched by FullName
 */
export default interface HumanService<E extends Human> extends EntityService<E> {
    findByFullName (fullName: FullName): Promise<PagedResponse<E>>;
}