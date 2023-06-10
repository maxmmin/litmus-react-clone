import {JurPerson} from "../../../../model/jurPerson/JurPerson";
import LookupService from "../LookupService";


interface JurPersonLookupService extends LookupService<JurPerson> {
    findByName (name: string): Promise<JurPerson[]>
}

export default JurPersonLookupService;