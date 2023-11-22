import CreationApiService from "../creation/api/CreationApiService";
import ExplorationApiService from "../exploration/api/ExplorationApiService";

/**
 * R - request DTO
 * P - response DTO
 * S - simple response DTO
 */
export default interface ApiService<R,P,S> extends CreationApiService<R, P>, ExplorationApiService<P,S> {
   remove(id: number): Promise<any>;
}