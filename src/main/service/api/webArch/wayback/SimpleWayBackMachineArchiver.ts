import WayBackMachineArchiver from "./WayBackMachineArchiver";
import CorsAnywhereProxyService from "../../nocorsproxy/CorsAnywhereProxyService";
import CorsAnywhereProxyServiceImpl from "../../nocorsproxy/CorsAnywhereProxyServiceImpl";

export default class SimpleWayBackMachineArchiver implements WayBackMachineArchiver{
    private static wayBackSaveUrl = "https://web.archive.org/save/";


    constructor(protected readonly corsAnywhereProxyService: CorsAnywhereProxyService) {
    }

    public static getInstance (corsAnywhereProxyService: CorsAnywhereProxyService = CorsAnywhereProxyServiceImpl.getInstance()) {
        return new SimpleWayBackMachineArchiver(corsAnywhereProxyService);
    }

    async archive(url: string): Promise<unknown> {
        const formData: FormData = new FormData();
        formData.set("url", url)
        await this.corsAnywhereProxyService.withProxy<unknown, FormData>({url: SimpleWayBackMachineArchiver.wayBackSaveUrl, method: "POST", data: formData})
            .then(r=>{
                if (r.status === 200) console.log(`${url} was successfully saved on ${SimpleWayBackMachineArchiver.wayBackSaveUrl}`);
                return r;
            })
        return Promise.resolve();
    }
}