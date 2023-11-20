import CreationApiService from "../creation/api/CreationApiService";
import ExplorationApiService from "../exploration/api/ExplorationApiService";

/**
 * R - request DTO
 * P - response DTO
 */
export default interface ApiService<R,P> extends CreationApiService<R, P>, ExplorationApiService<P> {
   remove(id: number): Promise<any>;
}