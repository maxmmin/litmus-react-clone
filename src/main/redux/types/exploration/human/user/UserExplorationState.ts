import User from "../../../../../model/human/user/User";
import UserExplorationParams, {BasicUserExplorationParams} from "./UserExplorationParams";
import EntityExplorationState from "../../EntityExplorationState";
import EntityExplorationData from "../../EntityExplorationData";

export default interface UserExplorationState extends EntityExplorationState<User, UserExplorationParams> {}

export class BasicUserExplorationState implements EntityExplorationState<User, UserExplorationParams> {
    readonly data: EntityExplorationData<User, UserExplorationParams>|null = null;
    isPending: boolean = false;
    readonly params: UserExplorationParams = new BasicUserExplorationParams();
    validationErrors: Partial<Record<keyof UserExplorationParams, string>> = {};

}
