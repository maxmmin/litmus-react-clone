import {Entity} from "../redux/exploration/EntityExplorationState";

type AppConfig = {
    apiHost: string,
    entitiesPerPage: number,
    geoApiKey: string,
    entityDomains: Readonly<Record<Entity, string>>,
    serverMappings: Readonly<typeof serverMappings>,
    applicationMappings: Readonly<typeof applicationMappings>
    apiAuthHeader: string
}

const host = "http://localhost:8081";

const apiRoot = `${host}/api`
const authRoot = `${host}/auth`

const entitiesPerPage = 50;
const geoApiKEy = "AIzaSyANxtNc5B2xbpNjhs84bIR_YWRd5RMoymA";
const apiAuthHeader = "Authorization"

const entityDomains: AppConfig['entityDomains'] = Object.freeze({
    [Entity.USER]: "users",
    [Entity.PERSON]: "persons",
    [Entity.JUR_PERSON]: "jur_persons"
})

const serverMappings = Object.freeze({
    "users": apiRoot.concat(entityDomains.USER),
    "persons": apiRoot.concat(entityDomains.PERSON),
    "jurPersons": apiRoot.concat(entityDomains.JUR_PERSON),
    "refreshTokens":  authRoot.concat("/refresh"),
    "signIn": authRoot.concat("/sign-in")
})

const explorationRoot = "/explore";

const personExplorationMapping = explorationRoot.concat(entityDomains.PERSON)

const applicationMappings = Object.freeze({
    default: personExplorationMapping,
    explorationRoot: explorationRoot,
    explorePersons: personExplorationMapping,
    exploreUsers: explorationRoot.concat(entityDomains.USER),
    exploreJurPersons: explorationRoot.concat(entityDomains.JUR_PERSON)
})

const appConfig: AppConfig = {
    apiHost: host,
    entitiesPerPage: entitiesPerPage,
    geoApiKey: geoApiKEy,
    entityDomains: {
        [Entity.USER]: "users",
        [Entity.PERSON]: "persons",
        [Entity.JUR_PERSON]: "jur_persons"
    },
    serverMappings: serverMappings,
    applicationMappings: applicationMappings,
    apiAuthHeader: apiAuthHeader
}

export default appConfig;


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

