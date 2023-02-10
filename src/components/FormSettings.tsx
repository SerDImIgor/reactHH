import React,{useState,useEffect} from 'react'
import {loadData,ErrorNet} from '../data/loadData'
export type FormGenerationProps = {
  onSubmit: () => void;
} 

type JsonData = {
  name: string;
  url: string;
  id: number;
}

export const FormSettings = (props:FormGenerationProps) => {

  const [UrlNameArray,setData] = useState<JsonData []>([])
  const [errorMessage,setErrorMessage] = useState<string|null>(null)
  const [isLoading,setIsLoading] = useState(false)
  
  const [login,setLogin] = useState('')
  const [repo,setRepo] = useState('')
  const [blacklist,setBlackList] = useState<string[]>([])
  const [hideSettings,sethideSettings] = useState(false);


  useEffect(() => {
    const logUrl = localStorage.getItem("LogUrl");
    if (logUrl) {
      const dtLocalStorage = JSON.parse(logUrl) as {login: string,repo:string ,data: JsonData[]}
      setLogin(dtLocalStorage.login);
      setRepo(dtLocalStorage.repo);
      setData(dtLocalStorage.data);
    }
    
    let value = localStorage.getItem("blackList");
    if (value) {
      const tmpList = JSON.parse(value);
      setBlackList(tmpList);
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
    setBlackList(tmpList);
    localStorage.setItem('blackList',JSON.stringify(tmpList));
    const arrayUrl:{url:string,name:string,id:number}[] = [];
    const blackListNumber = tmpList.map(x => Number(x))
    UrlNameArray.forEach((x) => { 
      if (!blackListNumber.includes(x.id)) {
          arrayUrl.push(x);
      }
    })
    localStorage.setItem('listWithoutBlack',JSON.stringify(arrayUrl));
    props.onSubmit();
  }
  const updateListReviewer = (result: {name: string, url: string,id: number} [] )=> {
    localStorage.setItem("LogUrl",JSON.stringify({login: login,repo: repo,data:result}));
    localStorage.removeItem("blackList");
    localStorage.setItem('listWithoutBlack',JSON.stringify(result));
    setBlackList([]);
  }

  const hanleSubmit = async(e : React.SyntheticEvent) =>{
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await loadData(`https://api.github.com/repos/${login}/${repo}/contributors`);
      const result = data.map((u:any) => {
        return {name:u.login as string, url:  u.avatar_url as string,id: u.id as number};
      })
      const logUrl = localStorage.getItem("LogUrl");
      if (logUrl) {
        const dtLocalStorage = JSON.parse(logUrl) as {login: string,repo:string ,data: JsonData[]}
        if ( dtLocalStorage.login !== login || dtLocalStorage.repo !== repo) {
          updateListReviewer(result)          
        }
      } else {
        updateListReviewer(result)
      }
      setData(result);
      setErrorMessage('');
    } catch(err : unknown) {
        if (err instanceof ErrorNet) {
          setErrorMessage(`It seems that you do not have an internet connection or the server is not available ${err.message}`);
        }  else{
          setErrorMessage(`Something happened with json data from local storage ${(err as Error).message }`); 
        }
        setData([] as JsonData[]);
        localStorage.removeItem("blackList");
        localStorage.removeItem("listWithoutBlack");
        localStorage.removeItem("LogUrl");
    } finally{
      props.onSubmit();
      setIsLoading(false);  
    }
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
          <select className='input-element select' value={blacklist}  multiple onChange={(e) => handleChange(e) }>
          {
            UrlNameArray.length>0 &&
              UrlNameArray.map( (x) => 
                <option key={x.id} value={x.id}>{x.name}</option> )
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