import PagedData from "../../../../rest/PagedData";
import LookupService from "../ExplorationApiService";
import FullName from "../../FullName";

/**
 * E - entity can be searched by FullName
 */
export default interface HumanExplorationApiService<P> extends LookupService<P> {
    findByFullName (fullName: FullName, i: number): Promise<PagedData<P>>;
}