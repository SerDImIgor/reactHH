import React,{useState,useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {githubUser} from '../users/userTypes'
import {fetchUsers} from '../users/userAction'
import {fetchUserFromGithub} from '../users/userAction'
import {RootState } from '../redux/store'
import {
  SET_LIST_CONTRIBUTOR,
  SET_BLACK_LIST,
  SET_LOGIN_REPOSITORY,
  SET_REPO_NAME
} from '../users/userTypes'

export const FormSettings = () => {

  const UrlNameArray = useSelector((state: RootState) => state.user.users) 
  const errorMessage = useSelector((state: RootState) => state.user.error)
  const isLoading = useSelector((state: RootState) => state.user.loading)
  
  const [login,setLogin] = useState('')
  const [repo,setRepo] = useState('')
  const blacklist = useSelector((state: RootState) => state.user.black_list) 
  const [hideSettings,sethideSettings] = useState(false);

  const dispatch = useDispatch();
  const dispatchFetch = useDispatch() as (fn:fetchUserFromGithub) => Promise<githubUser[]> 
  
  useEffect(() => {
    const logUrl = localStorage.getItem("LogUrl");
    if (logUrl) {
      const dtLocalStorage = JSON.parse(logUrl) as {login: string,repo:string ,data: githubUser[]}
        if (dtLocalStorage.data !== null) {
          dispatch({ 
              type: SET_LIST_CONTRIBUTOR,
              payload : dtLocalStorage.data
            });
      }
      if (dtLocalStorage.login !== null) {
          dispatch({
            type: SET_LOGIN_REPOSITORY,
            payload : dtLocalStorage.login
          });
          setLogin(dtLocalStorage.login)
      }

      if (dtLocalStorage.repo !== null) {
        dispatch({
          type: SET_REPO_NAME,
          payload : dtLocalStorage.repo
        });
        setRepo(dtLocalStorage.repo);
      }
    }
    let value = localStorage.getItem("blackList");
    if (value) {
      const tmpList = JSON.parse(value);
      dispatch({
        type: SET_BLACK_LIST,
        payload : tmpList
      });
    }
  },[]);

  const handleChange = (e: React.BaseSyntheticEvent ) => {
    let options = e.target.options;
    let tmpList: string[] = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        tmpList.push(options[i].value);
      }
    }
    const blacklst = tmpList.map((x:string) => x)
    dispatch({
      type: SET_BLACK_LIST,
      payload : tmpList
    });
    localStorage.setItem('blackList',JSON.stringify(blacklst));
  }
  
  const hanleSubmit = async(e : React.SyntheticEvent) =>{
    e.preventDefault();
    dispatchFetch(fetchUsers(login,repo)).then((dt:githubUser[])=>{
      if(dt.length>0) {
        localStorage.setItem("LogUrl",JSON.stringify({login: login,repo: repo,data:dt}));
      } else {
        localStorage.removeItem("LogUrl");
      }
      localStorage.removeItem("blackList");
    });
  }  
return (
  <div className="create">
    {!hideSettings && <button onClick={()=>{sethideSettings(true)}}>Show Settings</button>}
    {hideSettings && <button onClick={()=>{sethideSettings(false)}}>Hide Settings</button>}
    {hideSettings &&<div>
      <h2>Settings</h2>
      <form onSubmit={hanleSubmit}>
          <label>Enter login:</label>
          <input className="input-element" type="text" 
            required 
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            />
          <label>Enter repo:</label>
          <input className="input-element" type="text"
            required 
            value={repo} 
            onChange={(e) => setRepo(e.target.value)} />
          
          <label>Black list:</label>
          <select className='input-element select' value={ blacklist && blacklist.map(x=> String(x))} multiple onChange={(e) => handleChange(e) }>
          {
              UrlNameArray &&
              UrlNameArray.map( (x) => 
                  <option key={x.id} value={x.id}>{x.login}</option> )
          }
          </select>
          {!isLoading &&<button>Load data</button>}
          {isLoading &&<button disabled>Loading data ...</button>}
          {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>}
  </div>
)
}