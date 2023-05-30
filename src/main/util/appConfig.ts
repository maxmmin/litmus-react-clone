import {Entity} from "../types/explorationParams";

const host = "http://localhost:8081";

// const host = "http://192.168.111.204:8081"

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
    [Entity.PERSONS]: `${api}/persons`,
    [Entity.USERS]: `${api}/users`,
    [Entity.JUR_PERSONS]: `${api}/jur-persons`,
}

export const routingLinks = {
    explore: {
        [Entity.PERSONS]: `/explore/${Entity.PERSONS.toLowerCase()}`,
        [Entity.JUR_PERSONS]: `/explore/${Entity.JUR_PERSONS.toLowerCase()}`,
        [Entity.USERS]: `/explore/${Entity.USERS.toLowerCase()}`
    },
    create: {
        [Entity.PERSONS]: `/create/${Entity.PERSONS.toLowerCase()}`,
        [Entity.JUR_PERSONS]: `/create/${Entity.JUR_PERSONS.toLowerCase()}`,
        [Entity.USERS]: `/create/${Entity.USERS.toLowerCase()}`
    }
}

export const createAuthHeader = (accessToken: string) => ({
    [authHeader]: `Bearer ${accessToken}`
})

export default apiLinks