import {Tables} from "../types/explorationParams";

const host = "http://localhost:8081";

// const host = "http://192.168.137.89:8081"

export const entitiesPerPage = 3;

const auth = `${host}/auth`

const api = `${host}/api`

const persons = `${api}/persons`

const users = `${api}/users`

const jurPersons = `${api}/jur-persons`

const authHeader = 'Authorization'

const appConfig = {
    signIn: `${auth}/sign-in`,
    refreshAccessKey: `${auth}/refresh`,
    getThisUser: auth,
    [Tables.PERSONS]: persons,
    [Tables.USERS]: users,
    [Tables.JUR_PERSONS]: jurPersons
}

export const createAuthHeader = (accessToken: string) => ({
    [authHeader]: `Bearer ${accessToken}`
})

export default appConfig