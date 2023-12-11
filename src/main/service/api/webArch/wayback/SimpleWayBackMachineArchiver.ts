import axios, {AxiosInstance} from "axios";
import axiosRetry from "axios-retry";
import WayBackMachineArchiver from "./WayBackMachineArchiver";

export default class SimpleWayBackMachineArchiver implements WayBackMachineArchiver{
    private static wayBackSaveUrl = "https://web.archive.org/save/";

    private axiosInstance: AxiosInstance = axios.create({
        baseURL: SimpleWayBackMachineArchiver.wayBackSaveUrl,
        withCredentials: false,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })

    constructor() {
        axiosRetry(this.axiosInstance, {
            retries: 10,
            retryDelay: (retryCount, _e) => retryCount*1000,
            retryCondition: _error => true
        })
    }

    public static getInstance () {
        return new SimpleWayBackMachineArchiver();
    }

    async archive(url: string): Promise<unknown> {
        const formData: FormData = new FormData();
        formData.set("url", url)
        await this.axiosInstance.post<unknown>(SimpleWayBackMachineArchiver.wayBackSaveUrl, formData)
            .then(r=>{
                if (r.status === 200) console.log(`${url} was successfully saved on ${SimpleWayBackMachineArchiver.wayBackSaveUrl}`);
                return r;
            })
        return Promise.resolve();
    }
}