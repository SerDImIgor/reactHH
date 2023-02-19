import axios from 'axios'
import { Dispatch} from "redux"
import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS, 
    FETCH_USERS_FAILURE,
    SET_BLACK_LIST,
    SET_LIST_CONTRIBUTOR,
    SET_LOGIN_REPOSITORY,
    SET_REPO_NAME
} from './userTypes'
import {githubUser} from "./userTypes";


export interface UserLoading {
    type: typeof FETCH_USERS_REQUEST
    payload:  boolean
}

export interface UsersSuccess  {
    type : typeof FETCH_USERS_SUCCESS,
    payload: {users:githubUser[],login:string,repo:string}
}

export interface UsersFailure  {
    type : typeof FETCH_USERS_FAILURE,
    payload : string
}

export interface Contributor  {
    type : typeof SET_LIST_CONTRIBUTOR,
    payload : githubUser []
}

export interface BlackList  {
    type : typeof SET_BLACK_LIST,
    payload : string[]
}
export interface LoginRepository  {
    type : typeof SET_LOGIN_REPOSITORY,
    payload : string
}

export interface RepoName  {
    type : typeof SET_REPO_NAME,
    payload :  string
}

export type userDispatchType  = UserLoading | UsersSuccess | UsersFailure | Contributor  | BlackList | LoginRepository |  RepoName  

export type fetchUserFromGithub = (
  dispatch: Dispatch<userDispatchType>,
) => Promise<githubUser[]>;


export const fetchUsers = (login: string,repo :string) => async (dispatch: Dispatch<userDispatchType>) => {
    try {
      dispatch({
        type: FETCH_USERS_REQUEST,
        payload: true
      })
      const res = await axios.get(`https://api.github.com/repos/${login}/${repo}/contributors`);
      dispatch({
        type: FETCH_USERS_SUCCESS,
        payload: {users: res.data,login:login,repo:repo},
      })
      return res.data;  
    } catch(err) {
        const errorMsg = (err as Error).message;
        dispatch({
        type: FETCH_USERS_FAILURE,
        payload : errorMsg
      })
      return []
    }
  };