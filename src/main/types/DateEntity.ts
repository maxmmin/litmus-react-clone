export type DateEntity = {
    day: string,
    month: string,
    year: string
}

export const getInitialDate = (): DateEntity => ({
    day: "",
    month: "",
    year: ""
})