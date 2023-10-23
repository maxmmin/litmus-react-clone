interface Human extends FullName {

}

export interface FullName {
    firstName: string,
    middleName: string|null,
    lastName: string
}

export interface FullNameCreationParams {
    firstName: string,
    middleName: string,
    lastName: string
}

export interface HumanCreationParams extends FullNameCreationParams {
}

export default Human;