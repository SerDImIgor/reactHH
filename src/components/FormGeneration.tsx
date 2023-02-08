import {useState,useEffect} from 'react'

export type FormGenerationProps = {
    stateFlagImg: {url: string,name: string,id:number }[]
} 
let stopTimer:boolean = false;
export const FormGeneration = (prop : FormGenerationProps) => {
    const [errorMessage,setErrorMessage] = useState('');
    const [urlPathLogin, setUrlPathLogin] = useState({url:'', login:''} as {url: string,login: string});
    const [progresState,setProgressState] = useState(0);
    const [hideIcon,setHideIcon] = useState(true);
    
    useEffect(() => {
        stopTimer = true
    },[prop.stateFlagImg]);

    const generateReviewer = (lstReviewer: {url: string,name: string,id:number }[]) => {
        let isGetFirstReviewer:boolean = false;
        const timer = setInterval(() => {
            if (progresState < 100) {
                const randomIndex = Math.floor((Math.random() * lstReviewer.length));
                setProgressState( (oldValue) => {
                    let newValue = oldValue + 10;
                    if (newValue>=100){
                        clearInterval(timer)
                        return 0;
                    }
                    return newValue;
                })
                if(stopTimer)
                {
                    setHideIcon(true);
                    setProgressState(0);
                    clearInterval(timer)
                    return;
                }
                const el = lstReviewer[randomIndex];
                if(el.url.length>0 && el.name.length>0) {
                    
                    setUrlPathLogin({url:el.url,login: el.name});
                    if(isGetFirstReviewer)
                    {
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
                {progresState===0  && <button onClick={()=>{
                    const reviewer = localStorage.getItem("listWithoutBlack");
                    if (reviewer) {
                        let lstReviewer = JSON.parse(reviewer) as {url: string,name: string,id:number }[]
                        if(lstReviewer.length>0) {
                            setErrorMessage('');
                            setProgressState(0);
                            stopTimer = false;
                            generateReviewer(lstReviewer)
                        } else{
                            setErrorMessage(`Can't load list reviewers`);
                        }
                    } else{
                        setErrorMessage(`Can't load list reviewers`);
                    }
                    }}>Generate reviewer</button>
                }
                {progresState > 0 && <button disabled>Searching...</button>}
                {errorMessage.length > 0 && <p>{errorMessage}</p>}
            </div>            
        </div>
    )
}