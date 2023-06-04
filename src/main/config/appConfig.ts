import {Entity} from "../redux/exploration/EntityExplorationState";

type AppConfig = {
    apiHost: string,
    entitiesPerPage: number,
    geoApiKey: string,
    entityDomains: Readonly<Record<Entity, string>>,
    apiMapping: Readonly<typeof apiMapping>,
    apiAuthHeader: string
}

const apiHost = "http://localhost:8081";
const entitiesPerPage = 50;
const geoApiKEy = "AIzaSyANxtNc5B2xbpNjhs84bIR_YWRd5RMoymA";
const apiAuthHeader = "Authorization"

const entityDomains: AppConfig['entityDomains'] = Object.freeze({
    [Entity.USER]: "users",
    [Entity.PERSON]: "persons",
    [Entity.JUR_PERSON]: "jur_persons"
})

const apiMapping = Object.freeze({
    "user": apiHost.concat("/", entityDomains.USER),
    "person": apiHost.concat("/", entityDomains.PERSON),
    "jurPerson": apiHost.concat("/", entityDomains.JUR_PERSON)
})

const appConfig: AppConfig = {
    apiHost: apiHost,
    entitiesPerPage: entitiesPerPage,
    geoApiKey: geoApiKEy,
    entityDomains: {
        [Entity.USER]: "users",
        [Entity.PERSON]: "persons",
        [Entity.JUR_PERSON]: "jur_persons"
    },
    apiMapping: apiMapping,
    apiAuthHeader: apiAuthHeader
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

