import {useState, useEffect} from 'react';
import Logo from '../logos/logo_listery.svg'


const Header = ({ chooseView }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
    chrome.storage.local.get(['userLoggedIn']).then((result) => {
			console.log(result);
      setIsLoggedIn(result);
      if (result) chooseView('main')
		});

  }, []);

	const handleLogout = () => {
    setIsLoggedIn(false);
    chrome.storage.local.set({ 'userLoggedIn':'false' });
    chooseView('login1')
  };

  return (
    <div className='header'>
			<Logo className='logo-container'/>
      {isLoggedIn && <span onClick={handleLogout}>Log out</span>}
    </div>
  );
};

export default Header;