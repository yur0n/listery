import {useState} from 'react';

import Header from './components/Header'
import Login1 from './components/Login1';
import Login2 from './components/Login2';
import Registration from './components/Registration'
import Main from './components/Main';

const App = () => {
  const [currentView, setCurrentView] = useState('login1');



  const chooseView = (view) => {
    setCurrentView(view)
    console.log(view)
  }

  return (
    <main>
      <Header chooseView={chooseView}/>
      <Main chooseView={chooseView}/>
      {/* {currentView === 'login1' && (
        <Login1 chooseView={chooseView}/>
      )}
      {currentView === 'login2' && (
        <Login2 chooseView={chooseView}/>
      )}
      {currentView === 'registration' && (
        <Registration chooseView={chooseView}/>
      )}
      {currentView === 'main' && (
        <Main chooseView={chooseView}/>
      )} */}
			{/* <button onClick={scan}>SCAN</button>
      <h2>Title: {data.title}</h2>
      <h2>Price: {data.price}</h2>
      <h2>Somethong: {data.extra}</h2> */}
    </main>
  );
};
export default App;