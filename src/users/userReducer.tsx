import {loadData,githubUser} from "./userTypes";
import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS, 
    FETCH_USERS_FAILURE,
    SET_LIST_CONTRIBUTOR,
    SET_BLACK_LIST,
} from './userTypes'

import {userDispatchType} from "./userAction"
const initialState = {
    loading : false,
    users : [] as githubUser [],
    black_list: [] as string [],
    login_repository:'',
    repo_name:'',
    error : ''
}


export const userReducer = ( state:loadData = initialState, action: userDispatchType ):loadData =>
{
    switch(action.type)
    {
        case FETCH_USERS_REQUEST:
            return {
                loading:true, 
                users:[] as githubUser[],
                black_list: [] as string[],
                login_repository:'',
                repo_name:'',
                error:''
            }
        case FETCH_USERS_SUCCESS:
            const data = action.payload as {users:githubUser[],login:string,repo:string}
            return {
                ...state,
                loading: false,
                users: data.users,
                repo_name:data.repo,
                login_repository:data.login,
            }
        case FETCH_USERS_FAILURE:
            return {
                ...state,
                loading: false, 
                users:[] as githubUser[],
                black_list: [] as string[],
                error: action.payload as string
            }
        case SET_LIST_CONTRIBUTOR:
            return {
                ...state,
                users: action.payload as githubUser[],
                black_list: [] as string[],
            }
        case SET_BLACK_LIST:
            return {
                ...state,
                black_list: action.payload as string[],
            }
        default:
            return state
    }
}