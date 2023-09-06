import {buildUrl} from "../util/pureFunctions";
import {Entity} from "../model/Entity";

type AppConfig = {
    entitiesPerPage: number,
    geoApiKey: string,
    entityDomains: Readonly<Record<Entity, string>>,
    serverMappings: Readonly<typeof serverMappings>,
    applicationMappings: Readonly<typeof applicationMappings>
    authHeader: string,
    xsrfCookieName: string,
    xsrfHeaderName: string
}

const host = "http://localhost:8081";

const apiRoot = `/api`
const authApiRoot = `/auth`
const entitiesPerPage = 50;
const geoApiKEy = "AIzaSyANxtNc5B2xbpNjhs84bIR_YWRd5RMoymA";
const apiAuthHeader = "Authorization"

const entityDomains: AppConfig['entityDomains'] = Object.freeze({
    [Entity.USER]: "users",
    [Entity.PERSON]: "persons",
    [Entity.JUR_PERSON]: "jur-persons"
})

const serverMappings = Object.freeze({
    apiHost: host,
    apiRoot: apiRoot,
    "mediaRoot": buildUrl(apiRoot, "/media"),
    "users": buildUrl(apiRoot, entityDomains.USER),
    "persons": buildUrl(apiRoot, entityDomains.PERSON),
    "jurPersons": buildUrl(apiRoot, entityDomains.JUR_PERSON),
    "csrfToken": '/csrf-token',
    "getCurrentUser": buildUrl(authApiRoot),
    "refreshTokens": buildUrl(authApiRoot, "/refresh"),
    "logout": buildUrl(authApiRoot,"/logout"),
    "signIn": buildUrl(authApiRoot, "/sign-in")
})

const explorationRoot = "/explore";

const personExplorationMapping = buildUrl(explorationRoot, entityDomains.PERSON)

const creationRoot = "/create";

const personCreationMapping = buildUrl(creationRoot, entityDomains.PERSON)

const applicationRoot = "/"

const applicationMappings = Object.freeze({
    signIn: "/sign-in",
    home: applicationRoot,
    getEntity: {
        [Entity.USER]: buildUrl(applicationRoot,entityDomains.USER,':id'),
        [Entity.PERSON]: buildUrl(applicationRoot,entityDomains.PERSON,':id'),
        [Entity.JUR_PERSON]: buildUrl(applicationRoot,entityDomains.JUR_PERSON,':id')
    },
    exploration: {
        default: personExplorationMapping,
        root: explorationRoot,
        [Entity.PERSON]: personExplorationMapping,
        [Entity.JUR_PERSON]: buildUrl(explorationRoot, entityDomains.JUR_PERSON),
        [Entity.USER]: buildUrl(explorationRoot, entityDomains.USER)
    },
    creation: {
        default: personCreationMapping,
        root: creationRoot,
        [Entity.PERSON]: personCreationMapping,
        [Entity.JUR_PERSON]: buildUrl(creationRoot, entityDomains.JUR_PERSON),
        [Entity.USER]: buildUrl(creationRoot, entityDomains.USER)
    }
})

const appConfig: AppConfig = {
    entitiesPerPage: entitiesPerPage,
    geoApiKey: geoApiKEy,
    entityDomains: entityDomains,
    serverMappings: serverMappings,
    applicationMappings: applicationMappings,
    authHeader: apiAuthHeader,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
}

export default appConfig;


export const gmapsRegionOptions: {region: string, language: string} = {
    region: "UA",
    language: "ua"
}

export const createAuthHeader = (accessToken: string) => ({
    [appConfig.authHeader]: `Bearer ${accessToken}`
})

