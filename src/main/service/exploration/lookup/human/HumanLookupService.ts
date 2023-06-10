import {FullName} from "../../FullName";
import PagedData from "../../../../util/apiRequest/PagedData";
import {Human} from "../../../../model/human/Human";
import LookupService from "../LookupService";

/**
 * E - entity can be searched by FullName
 */
export default interface HumanLookupService<E extends Human> extends LookupService<E> {
    findByFullName (fullName: FullName): Promise<PagedData<E>>;
}