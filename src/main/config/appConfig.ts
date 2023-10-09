import {buildUrl} from "../util/pureFunctions";
import {Entity} from "../model/Entity";

type AppConfig = {
    entitiesPerPage: number,
    geoApiKey: string,
    entityDomains: Readonly<Record<Entity, string>>,
    serverMappings: Readonly<typeof serverMappings>,
    applicationMappings: Readonly<typeof applicationMappings>
    xsrfCookieName: string,
    xsrfHeaderName: string
}

const host = "http://localhost:8081";

const apiRoot = `/api`
const authApiRoot = `/auth`
const entitiesPerPage = 50;
const geoApiKEy = "AplsM3q0nzBnkkYGFC3NOXLr_XIeqbG2NQRxONopsPIeneujRujL86u_PWQC5hfh";

const entityDomains: AppConfig['entityDomains'] = Object.freeze({
    [Entity.USER]: "users",
    [Entity.PERSON]: "persons",
    [Entity.JUR_PERSON]: "jur-persons"
})

const personsRoot = buildUrl(apiRoot, entityDomains.PERSON);

const serverMappings = Object.freeze({
    apiHost: host,
    apiRoot: apiRoot,
    mediaRootUrl: buildUrl(host,apiRoot, "/media/"),
    users: {
        root: buildUrl(apiRoot, entityDomains.USER)
    },
    persons: {
        root: personsRoot,
        getByIdList: buildUrl(personsRoot, "/id-list"),
        relationships: (id: string)=>buildUrl(personsRoot, id, "/relationships")
    },
    jurPersons: {
        root: buildUrl(apiRoot, entityDomains.JUR_PERSON)
    },
    auth: {
        refreshTokens: buildUrl(authApiRoot, "/refresh"),
        logout: buildUrl(authApiRoot,"/logout"),
        signIn: buildUrl(authApiRoot, "/sign-in"),
        getCurrentUser: buildUrl(authApiRoot)
    },
    csrfToken: '/csrf-token'
})

const explorationRoot = "/explore";

const personExplorationMapping = buildUrl(explorationRoot, entityDomains.PERSON)

const creationRoot = "/create";

const personCreationMapping = buildUrl(creationRoot, entityDomains.PERSON)

const applicationRoot = "/"

const applicationMappings = Object.freeze({
    signIn: "/sign-in",
    root: applicationRoot,
    entityRoot: {
        [Entity.USER]: buildUrl(applicationRoot,"/users"),
        [Entity.PERSON]: buildUrl(applicationRoot,"/persons"),
        [Entity.JUR_PERSON]: buildUrl(applicationRoot,"/jur-persons")
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
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
}

export default appConfig;


export const gmapsRegionOptions: {region: string, language: string} = {
    region: "UA",
    language: "ua"
}
