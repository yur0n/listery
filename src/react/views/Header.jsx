
import Logo from '../icons/logo_listery.svg'


const Header = ({ isLoggedIn, handleLogin }) => {

  return (
    <div className='header'>
			<Logo className='logo-container'/>
      {isLoggedIn && <span onClick={() => handleLogin(false)}>Log out</span>}
    </div>
  );
};

export default Header;