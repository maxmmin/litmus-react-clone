import {FullName} from "../../FullName";
import PagedData from "../../../../rest/PagedData";
import {Human} from "../../../../model/human/Human";
import LookupService from "../ExplorationApiService";

/**
 * E - entity can be searched by FullName
 */
export default interface HumanExplorationApiService<E extends Human> extends LookupService<E> {
    findByFullName (fullName: FullName): Promise<PagedData<E>>;
}