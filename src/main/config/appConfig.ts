import {buildMapping} from "../util/pureFunctions";
import {Entity} from "../redux/exploration/Entity";

type AppConfig = {
    apiHost: string,
    entitiesPerPage: number,
    geoApiKey: string,
    entityDomains: Readonly<Record<Entity, string>>,
    serverMappings: Readonly<typeof serverMappings>,
    applicationMappings: Readonly<typeof applicationMappings>
    authHeader: string
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
    [Entity.JUR_PERSON]: "jur-persons"
})

const serverMappings = Object.freeze({
    "users": buildMapping(apiRoot, entityDomains.USER),
    "persons": buildMapping(apiRoot, entityDomains.PERSON),
    "jurPersons": buildMapping(apiRoot, entityDomains.JUR_PERSON),
    "getCurrentUser": buildMapping(authRoot),
    "refreshTokens": buildMapping(authRoot, "/refresh"),
    "signIn": buildMapping(apiRoot, "/sign-in")
})

console.log(serverMappings)

const explorationRoot = "/explore";

const personExplorationMapping = buildMapping(explorationRoot, entityDomains.PERSON)

const creationRoot = "/create";

const personCreationMapping = buildMapping(explorationRoot, entityDomains.PERSON)

const applicationMappings = Object.freeze({
    exploration: {
        default: personExplorationMapping,
        root: explorationRoot,
        [Entity.PERSON]: personExplorationMapping,
        [Entity.JUR_PERSON]: buildMapping(explorationRoot, entityDomains.JUR_PERSON),
        [Entity.USER]: buildMapping(explorationRoot, entityDomains.USER)
    },
    creation: {
        default: personCreationMapping,
        root: creationRoot,
        createPersons: personCreationMapping,
        createJurPersons: buildMapping(creationRoot, entityDomains.USER),
        createUsers: buildMapping(creationRoot, entityDomains.USER)
    }
})

const appConfig: AppConfig = {
    apiHost: host,
    entitiesPerPage: entitiesPerPage,
    geoApiKey: geoApiKEy,
    entityDomains: entityDomains,
    serverMappings: serverMappings,
    applicationMappings: applicationMappings,
    authHeader: apiAuthHeader
}

export default appConfig;


export const gmapsRegionOptions: {region: string, language: string} = {
    region: "UA",
    language: "ua"
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
    [appConfig.authHeader]: `Bearer ${accessToken}`
})

