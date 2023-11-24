import PagedData from "../../../../rest/PagedData";
import ExplorationApiService from "../ExplorationApiService";
import {FullNameExploration} from "../../../../model/human/Human";


export default interface HumanExplorationApiService<P, S, H> extends ExplorationApiService<P, S, H> {
    findByFullName (fullName: FullNameExploration, i: number): Promise<PagedData<S>>;
}