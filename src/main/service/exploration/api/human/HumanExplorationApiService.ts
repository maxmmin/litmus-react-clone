import {FullName} from "../../FullName";
import PagedData from "../../../../rest/PagedData";
import LookupService from "../ExplorationApiService";

/**
 * E - entity can be searched by FullName
 */
export default interface HumanExplorationApiService<P> extends LookupService<P> {
    findByFullName (fullName: FullName): Promise<PagedData<P>>;
}