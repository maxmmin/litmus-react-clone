import {Tables} from "../types/explorationParams";

const host = "http://localhost:8081";

// const host = "http://192.168.137.89:8081"

export const entitiesPerPage = 50;

export const geoApiKey = "AIzaSyANxtNc5B2xbpNjhs84bIR_YWRd5RMoymA"

export const gmapsRegionOptions: {region: string, language: string} = {
    region: "UA",
    language: "ua"
}

const auth = `${host}/auth`

const api = `${host}/api`


const authHeader = 'Authorization'

const apiLinks = {
    signIn: `${auth}/sign-in`,
    refreshAccessKey: `${auth}/refresh`,
    getThisUser: auth,
    [Tables.PERSONS]: `${api}/persons`,
    [Tables.USERS]: `${api}/users`,
    [Tables.JUR_PERSONS]: `${api}/jur-persons`,
}

export const routingLinks = {
    explore: {
        [Tables.PERSONS]: `/explore/${Tables.PERSONS.toLowerCase()}`,
        [Tables.JUR_PERSONS]: `/explore/${Tables.JUR_PERSONS.toLowerCase()}`,
        [Tables.USERS]: `explore/${Tables.USERS.toLowerCase()}`
    },
    create: {
        [Tables.PERSONS]: `/create/${Tables.PERSONS.toLowerCase()}`,
        [Tables.JUR_PERSONS]: `/create/${Tables.JUR_PERSONS.toLowerCase()}`,
        [Tables.USERS]: `/create/${Tables.USERS.toLowerCase()}`
    }
}

export const createAuthHeader = (accessToken: string) => ({
    [authHeader]: `Bearer ${accessToken}`
})

export default apiLinks