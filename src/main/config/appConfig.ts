import {Entity} from "../redux/exploration/EntityExplorationState";

type AppConfig = {
    apiHost: string,
    entitiesPerPage: number,
    geoApiKey: string,
    entityDomains: Record<Entity, string>
}

const appConfig: AppConfig = {
    apiHost: "http://localhost:8081",
    entitiesPerPage: 50,
    geoApiKey: "AIzaSyANxtNc5B2xbpNjhs84bIR_YWRd5RMoymA",
    entityDomains: {
        [Entity.USER]: "users",
        [Entity.PERSON]: "persons",
        [Entity.JUR_PERSON]: "jur_persons"
    }
}

export default appConfig;

export const host = "http://localhost:8081";


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

