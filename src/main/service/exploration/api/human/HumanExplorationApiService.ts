import PagedData from "../../../../rest/PagedData";
import ExplorationApiService from "../ExplorationApiService";
import {FullNameExploration} from "../../../../model/human/Human";


export default interface HumanExplorationApiService<P, S> extends ExplorationApiService<P, S> {
    findByFullName (fullName: FullNameExploration, i: number): Promise<PagedData<S>>;
}