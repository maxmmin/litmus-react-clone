import CreationApiService from "./CreationApiService";
import ExplorationApiService from "./ExplorationApiService";

/**
 * R - request DTO
 * P - response DTO
 * S - simple response DTO
 * H - short response DTO
 */
export default interface EntityApiService<R,P,S,H> extends CreationApiService<R, P>, ExplorationApiService<P,S,H> {
   remove(id: number): Promise<any>;
}