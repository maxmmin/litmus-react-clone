import PersonService from "./PersonService";
import {FullName} from "../../exploration/FullName";
import Person from "../../../model/person/Person";
import appConfig from "../../../config/appConfig";
import BasicApiRequestManager from "../../../util/apiRequest/BasicApiRequestManager";
import {HttpMethod} from "../../../util/apiRequest/ApiRequestManager";
import BasicEntityService from "../BasicEntityService";

class PersonServiceImpl extends BasicEntityService<Person> implements PersonService {


    constructor(getToken: () => string, apiMapping: string = appConfig.apiMapping.person) {
        super(apiMapping, getToken);
    }

    async findByFullName(fullName: FullName): Promise<Person[]> {
        const requestManager = new BasicApiRequestManager();

        const token = this.getAccessToken();

        requestManager
            .url(this.apiUrl)
            .method(HttpMethod.GET)
            .authentication(token);

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