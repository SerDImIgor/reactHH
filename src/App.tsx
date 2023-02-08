import React from 'react';
import './App.css';
import { FormSettings} from './components/FormSettings';
import { FormGeneration} from './components/FormGeneration';
import {useState} from 'react'

function App() {
  
  const [dataForm,setFormData] = useState([] as {url: string,name: string,id:number }[]);
  const renderData = () =>
  {
    console.log('renderData')
    const reviewer = localStorage.getItem("listWithoutBlack");
    if (reviewer) {
      let lstReviewer = JSON.parse(reviewer) as {url: string,name: string,id:number }[]
      setFormData(lstReviewer);
    }
    else{
      setFormData([]);
    }
  }
  return (
    <div className="App">
      <div className='row'>
          <div className='column'>
            < FormSettings renderData={renderData} /> 
          </div>
          <div className='column'>
            <FormGeneration stateFlagImg={dataForm} />
          </div>
      </div>
    </div>
  );
}

export default App;


//let owner = 'twbs';
//let repo = 'bootstrap';