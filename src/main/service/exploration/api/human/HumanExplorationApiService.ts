import PagedData from "../../../../rest/PagedData";
import LookupService from "../ExplorationApiService";
import {FullName} from "../../../../model/human/Human";
import {Nullable} from "../../../../util/Nullable";

/**
 * E - entity can be searched by FullName
 */
export default interface HumanExplorationApiService<P> extends LookupService<P> {
    findByFullName (fullName: Partial<Nullable<FullName>>, i: number): Promise<PagedData<P>>;
}