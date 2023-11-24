import CreationApiService from "../creation/api/CreationApiService";
import ExplorationApiService from "../exploration/api/ExplorationApiService";

/**
 * R - request DTO
 * P - response DTO
 * S - simple response DTO
 * H - short response DTO
 */
export default interface ApiService<R,P,S, H> extends CreationApiService<R, P>, ExplorationApiService<P,S,H> {
   remove(id: number): Promise<any>;
}