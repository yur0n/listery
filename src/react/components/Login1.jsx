import Button from '../logos/login1-button.svg'

const Login1 = ({ chooseView }) => {

  return (
    <div className='main'>
			<div className='login-title'>
				Log in to your<br />Listery account
			</div>
			<div className='login1-bottom-button'>
				<Button className='login1-button' onClick={() => chooseView('login2')}/>
				<div className='login1-button-undertext'>(Don't have an account yet? <span onClick={() => chooseView('registration')}>Sign up!</span>)</div>
			</div>
    </div>
  );
};

export default Login1;