import User from "../../../../model/human/user/User";
import UserExplorationState from "../../../../redux/types/exploration/human/user/UserExplorationState";
import HumanExplorationStateManager from "../HumanExplorationStateManager";
import UserExplorationParams from "../../../../redux/types/exploration/human/user/UserExplorationParams";

export default interface UserExplorationStateManager extends HumanExplorationStateManager<User, UserExplorationParams> {};