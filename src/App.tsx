import React from 'react';
import './App.css';
import { FormSettings} from './components/FormSettings';
import { FormGeneration} from './components/FormGeneration';
import { Provider } from 'react-redux';
import { store } from './redux/store'
function App() {
  
  return (
    <Provider store={store}>
      <div className="App">
        <div className='row'>
            <div className='column'>
              < FormSettings /> 
            </div>
            <div className='column'>
              <FormGeneration/>
            </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
//https://www.youtube.com/watch?v=Lkng78QNWJA

//let owner = 'twbs';
//let repo = 'bootstrap';