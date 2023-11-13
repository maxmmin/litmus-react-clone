import PagedData from "../../../../rest/PagedData";
import LookupService from "../ExplorationApiService";
import {FullName, FullNameExploration} from "../../../../model/human/Human";
import {Nullable} from "../../../../util/types/Nullable";

/**
 * E - entityPageComponents can be searched by FullName
 */
export default interface HumanExplorationApiService<P> extends LookupService<P> {
    findByFullName (fullName: FullNameExploration, i: number): Promise<PagedData<P>>;
}