type CreateUserDto = {
    email: string;

    firstName: string;

    middleName: string;

    lastName: string;

    password: string

    role: string | null;

}

export default CreateUserDto;