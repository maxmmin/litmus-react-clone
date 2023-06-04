import PersonService from "./PersonService";
import {FullName} from "../../exploration/FullName";
import Person from "../../../model/person/Person";
import appConfig from "../../../config/appConfig";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import path from "path";
import {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import {BasicHttpError} from "../../../util/HttpStatus";

class PersonServiceImpl implements PersonService {
    private readonly apiUrl: string = appConfig.apiMapping.person;

    constructor(getToken: ()=>string) {
        this.getAuthToken = getToken;
    }

    private getAuthToken: ()=>string;

    async findById(id: string): Promise<Person> {
        const requestManager = new BasicApiRequestManager();
        const response = await requestManager
            .url(path.join(this.apiUrl, id))
            .method(HttpMethod.GET)
            .fetch();
        if (!response.ok) {
            throw new BasicHttpError(response.status, await BasicHttpError.getHttpErrorResponse(response));
        } else {
            return await response.json() as Person;
        }
    }

    async findByFullName(fullName: FullName): Promise<Person[]> {
        const requestManager = new BasicApiRequestManager();

        requestManager.url(this.apiUrl).method(HttpMethod.GET);

        for (const key in fullName) {
            if (Object.hasOwn(fullName, key)) {
                requestManager.setQueryParam(key,fullName[key]);
            }
        }
        const response = await requestManager.fetch();
        return await response.json() as Person[];
    }
}

export default PersonServiceImpl;