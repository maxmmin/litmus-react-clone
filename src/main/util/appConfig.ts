import {Entity} from "../redux/exploration/EntityExplorationState";

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
    [Entity.PERSON]: `${api}/persons`,
    [Entity.USER]: `${api}/users`,
    [Entity.JUR_PERSON]: `${api}/jur-persons`,
}

export const routingLinks = {
    explore: {
        [Entity.PERSON]: `/explore/${Entity.PERSON.toLowerCase()}`,
        [Entity.JUR_PERSON]: `/explore/${Entity.JUR_PERSON.toLowerCase()}`,
        [Entity.USER]: `/explore/${Entity.USER.toLowerCase()}`
    },
    create: {
        [Entity.PERSON]: `/create/${Entity.PERSON.toLowerCase()}`,
        [Entity.JUR_PERSON]: `/create/${Entity.JUR_PERSON.toLowerCase()}`,
        [Entity.USER]: `/create/${Entity.USER.toLowerCase()}`
    }
}

export const createAuthHeader = (accessToken: string) => ({
    [authHeader]: `Bearer ${accessToken}`
})

export default apiLinks