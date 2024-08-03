import {useState, useEffect} from 'react';

import Header from './views/Header'
import Login1 from './views/Login1';
import Login2 from './views/Login2';
import Registration from './views/Registration'
import Success from './views/Success';
import Main from './views/Main';

const App = () => {
  const [currentView, setCurrentView] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['userLoggedIn']).then(({ userLoggedIn }) => {
      logInOff(userLoggedIn);
    });
  }, []);

  async function handleLogin(status) {
    await chrome.storage.local.set({ userLoggedIn: status });
    logInOff(status);
  };

  function logInOff(isIn) {
    setIsLoggedIn(isIn);
    isIn ? chooseView('main') : chooseView('login1');
  }

  function chooseView(view) {
    setCurrentView(view)
  }

  return (
    <main>
      <Header isLoggedIn={isLoggedIn} handleLogin={handleLogin} />
      {currentView === 'success' && (
        <Success />
      )}
      {currentView === 'login1' && (
        <Login1 chooseView={chooseView}/>
      )}
      {currentView === 'login2' && (
        <Login2 handleLogin={handleLogin} />
      )}
      {currentView === 'registration' && (
        <Registration />
      )}
      {currentView === 'main' && (
        <Main chooseView={chooseView}/>
      )}
    </main>
  );
};
export default App;