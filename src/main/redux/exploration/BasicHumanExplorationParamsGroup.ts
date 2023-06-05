import EntityExplorationParams from "./EntityExplorationParams";

export default interface BasicHumanExplorationParamsGroup extends EntityExplorationParams{
    firstName: string | null,
    middleName: string | null,
    lastName: string | null
}