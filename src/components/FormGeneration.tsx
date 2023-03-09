import {useState, useEffect,useRef} from 'react'
import {TypedUseSelectorHook,useSelector} from 'react-redux'
import {githubUser} from '../users/userTypes'
import {RootState } from '../redux/store'
const progressSize = 100;
const progressStep = 10;
export const FormGeneration = () => {
    const [errorMessage,setErrorMessage] = useState('');
    const [whiteList,setWhiteList] = useState<githubUser[]>([]);
    const [urlPathLogin, setUrlPathLogin] = useState<{url: string,login: string}>({url:'', login:''});
    const [progresState,setProgressState] = useState(0);
    const [hideIcon,setHideIcon] = useState(true);
    const stopTimerRef = useRef(false);

    const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;
    const UrlNameArray = useAppSelector(state => state.user.users) 
    const blacklist = useAppSelector(state => state.user.black_list) 
   
    useEffect(() => {
        if(UrlNameArray!==undefined) {
            setWhiteList(UrlNameArray.filter(x=> !blacklist.includes(x.id.toString())));
        }
    stopTimerRef.current = true;
    },[UrlNameArray,blacklist]);
    const generateReviewer = (lstReviewer: githubUser[]) => {
        let isGetFirstReviewer:boolean = false;
        const timer = setInterval(() => {
            if (progresState < progressSize) {
                const randomIndex = Math.floor((Math.random() * lstReviewer.length));
                setProgressState( (oldValue) => {
                    let newValue = oldValue + progressStep;
                    if (newValue >= progressSize){
                        clearInterval(timer)
                        return 0;
                    }
                    return newValue;
                })
                if(stopTimerRef.current) {
                    setHideIcon(true);
                    setProgressState(0);
                    clearInterval(timer)
                    return;
                }
                const el = lstReviewer[randomIndex];
                if(el.avatar_url.length>0 && el.login.length>0) {
                    setUrlPathLogin({url:el.avatar_url,login: el.login});
                    if(isGetFirstReviewer) {
                        setHideIcon(false);
                    }
                    isGetFirstReviewer = true;
                }
            } else {
                clearInterval(timer);
            }
        }, 1000);
    }   
    return (
        <div className="create">
            <h2>Generate</h2>
            <div>
                {!hideIcon && 
                <div>
                    <div>
                        <h3>{urlPathLogin.login}</h3>
                        <img style={{width:'200px',height:'200px'}} src={urlPathLogin.url} alt="Pic reviewer" />
                    </div>
                    <div>
                        {progresState>0 && <progress value={progresState} max="100"></progress>}
                    </div>
                </div>                
                }
            </div>
            <div className="button-container">
                {whiteList && progresState === 0 && <button onClick={()=>{       
                    setErrorMessage('');
                    setProgressState(0);
                    stopTimerRef.current = false;
                    generateReviewer(whiteList);
                    }}>Generate reviewer</button>
                }
                {progresState > 0 && <button disabled>Searching...</button>}
                {errorMessage.length > 0 && <p>{errorMessage}</p>}
            </div>            
        </div>
    )
}