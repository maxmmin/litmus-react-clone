import {FullName} from "../../exploration/FullName";
import PagedResponse from "../PagedResponse";
import {Human} from "../../../model/human/Human";

/**
 * E - entity can be searched by FullName
 */
export default interface HumanService<E extends Human> {
    findByFullName (fullName: FullName): Promise<PagedResponse<E>>;
}