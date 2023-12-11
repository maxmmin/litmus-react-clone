import {buildUrl} from "../util/pureFunctions";
import {Entity} from "../model/Entity";
import backendOptionsData, {BackendOptions} from "./backendOptionsData";

type AppConfig = {
    backendOptions: BackendOptions,
    geoApiKey: string,
    entityDomains: Readonly<Record<Entity, string>>,
    serverMappings: Readonly<typeof serverMappings>,
    applicationMappings: Readonly<typeof applicationMappings>
    xsrfCookieName: string,
    xsrfHeaderName: string,
    csrfErrCode: string,
    paramsConfig: ParamsConfig
}

const backendOptions: BackendOptions = backendOptionsData;

const backendUrl = backendOptions.url;
const apiRoot = `/api`
const authApiRoot = `/auth`
const geoApiKEy = "AplsM3q0nzBnkkYGFC3NOXLr_XIeqbG2NQRxONopsPIeneujRujL86u_PWQC5hfh";

const entityDomains: AppConfig['entityDomains'] = Object.freeze({
    [Entity.USER]: "users",
    [Entity.PERSON]: "persons",
    [Entity.JUR_PERSON]: "jur-persons"
})

const personsRoot = buildUrl(apiRoot, entityDomains.PERSON);

const relativeApiPaths = {
    getByFullName: "/find/full-name",
    findByIdList: "/find/id-list"
}

const jpRoot = buildUrl(apiRoot, entityDomains.JUR_PERSON)

const usrRoot = buildUrl(apiRoot, entityDomains.USER);

const serverMappings = Object.freeze({
    apiHost: backendUrl,
    apiRoot: apiRoot,
    mediaRootUrl: buildUrl(backendUrl, apiRoot, '/media'),
    sharedApiPaths: relativeApiPaths,
    users: {
        root: usrRoot,
        getByEmail: buildUrl(usrRoot, '/email')
    },
    persons: {
        root: personsRoot,
        getByFullName: buildUrl(personsRoot, relativeApiPaths.getByFullName),
        getByIdList: buildUrl(personsRoot, relativeApiPaths.findByIdList),
        relationships: (id: string)=>buildUrl(personsRoot, id, "/relationships")
    },
    jurPersons: {
        root: jpRoot,
        getByName: buildUrl(jpRoot, "/find/name")
    },
    auth: {
        refreshTokens: buildUrl(authApiRoot, "/refresh"),
        logout: buildUrl(authApiRoot,"/logout"),
        signIn: buildUrl(authApiRoot, "/sign-in"),
        getCurrentUser: buildUrl(authApiRoot)
    },
    csrfToken: '/csrf-token',
    config: {
        roles: buildUrl(authApiRoot, '/roles')
    }
})

const explorationRoot = "/exploration";

const personExplorationMapping = buildUrl(explorationRoot, entityDomains.PERSON)

const creationRoot = "/creation";

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

type ParamsConfig = {
    lookupModeKeyName: string,
    indexKeyName: string
}

const paramsConfig: ParamsConfig = {
    lookupModeKeyName: "m",
    indexKeyName: "i"
}

const appConfig: AppConfig = {
    backendOptions: backendOptionsData,
    geoApiKey: geoApiKEy,
    entityDomains: entityDomains,
    serverMappings: serverMappings,
    applicationMappings: applicationMappings,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    csrfErrCode: 'csrf:error',
    paramsConfig: paramsConfig
}

export default appConfig;
