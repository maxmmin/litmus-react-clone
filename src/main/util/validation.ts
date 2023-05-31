export const validateId = (id: string) => {
    return id.split('').findIndex(strDigit=>isNaN(+strDigit))>-1
}

