import EntityExplorationParams from "../EntityExplorationParams";

export default interface HumanExplorationParams extends EntityExplorationParams {
    firstName: string | null,
    middleName: string | null,
    lastName: string | null
}