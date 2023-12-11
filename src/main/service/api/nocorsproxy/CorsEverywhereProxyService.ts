import {AxiosRequestConfig, AxiosResponse} from "axios";

export default interface CorsEverywhereProxyService {
    withProxy<D>(req: AxiosRequestConfig<D>): Promise<AxiosResponse<D>>;
}