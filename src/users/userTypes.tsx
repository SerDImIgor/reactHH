export const FETCH_USERS_REQUEST : string  = 'FETCH_USERS_REQUEST'
export const FETCH_USERS_SUCCESS : string = 'FETCH_USERS_SUCCESS'
export const FETCH_USERS_FAILURE : string = 'FETCH_USERS_FAILURE'
export const SET_BLACK_LIST : string = 'SET_BLACK_LIST'
export const SET_LIST_CONTRIBUTOR : string = 'SET_USER_LIST'
export const SET_LOGIN_REPOSITORY : string = 'SET_LOGIN_REPOSITORY'
export const SET_REPO_NAME : string = 'SET_REPO_NAME'

export type actonType = typeof FETCH_USERS_REQUEST | 
                    typeof FETCH_USERS_SUCCESS | 
                    typeof FETCH_USERS_FAILURE | 
                    typeof SET_LIST_CONTRIBUTOR | 
                    typeof SET_LOGIN_REPOSITORY |
                    typeof SET_REPO_NAME ;

export type githubUser = {
    login: string;
    id: string;
    avatar_url: string;
  }

export type loadData = {
    loading : boolean,
    users: githubUser[],
    black_list: string[], 
    login_repository: string,
    repo_name: string,
    error : string
}


