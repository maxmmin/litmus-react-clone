import {AxiosRequestConfig, AxiosResponse} from "axios";

export default interface CorsAnywhereProxyService {
    withProxy<D, B=any>(req: AxiosRequestConfig<D>): Promise<AxiosResponse<D>>;
}