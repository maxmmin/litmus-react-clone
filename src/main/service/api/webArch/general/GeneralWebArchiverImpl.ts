import GeneralWebArchiver from "./GeneralWebArchiver";
import WebPageArchiver from "../WebPageArchiver";
import SimpleWayBackMachineArchiver from "../wayback/SimpleWayBackMachineArchiver";

export default class GeneralWebArchiverImpl implements GeneralWebArchiver {
    private readonly webPageArchivers: WebPageArchiver<any>[];
    constructor(...webPageArchivers: WebPageArchiver<any>[]) {
        this.webPageArchivers = webPageArchivers;
    }

    public static getInstance(wayBackMachineArchList: WebPageArchiver<any>[] = [SimpleWayBackMachineArchiver.getInstance()]) {
        return new GeneralWebArchiverImpl(...wayBackMachineArchList);

    }

    async archive(url: string): Promise<unknown[]> {
        const res = await Promise.all(this.webPageArchivers.map(arch => arch.archive(url)));
        console.log("All of registered web archivers saved the page");
        return res;
    }
}