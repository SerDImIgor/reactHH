import React from 'react';
import './App.css';
import { FormSettings} from './components/FormSettings';
import { FormGeneration} from './components/FormGeneration';
import {useState} from 'react'

function App() {
  
  const [submitData,setSubmitData] = useState([] as {url: string,name: string,id:number }[]);
  const onSubmit = () =>
  {
    const reviewer = localStorage.getItem("listWithoutBlack");
    if (reviewer) {
      let lstReviewer = JSON.parse(reviewer) as {url: string,name: string,id:number }[]
      setSubmitData(lstReviewer);
    }
    else{
      setSubmitData([]);
    }
  }
  return (
    <div className="App">
      <div className='row'>
          <div className='column'>
            < FormSettings onSubmit={onSubmit} /> 
          </div>
          <div className='column'>
            <FormGeneration choiceList={submitData} />
          </div>
      </div>
    </div>
  );
}

export default App;


//let owner = 'twbs';
//let repo = 'bootstrap';