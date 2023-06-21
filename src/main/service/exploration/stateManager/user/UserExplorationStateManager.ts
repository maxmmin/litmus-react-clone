import ExplorationStateManager from "../ExplorationStateManager";
import User from "../../../../model/human/user/User";
import UserExplorationState from "../../../../redux/types/exploration/human/user/UserExplorationState";

export default interface UserExplorationStateManager extends ExplorationStateManager<User, UserExplorationState> {};