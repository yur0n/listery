import { useState } from 'react';

import OTP from './OTP'

const Login2 = ({ chooseView }) => {
	const [ otpWrong, setOtpWrong ] = useState(false);

	const otpResult = (result) => {
		result ? chooseView('main') : setOtpWrong(true);
	}
	
  return (
    <div className='main'>
			<div className='login-title'>
				Enter verification code
			</div>
			<OTP otpResult={otpResult}/>
			<div className='otp-wrong'>{otpWrong ? 'Incorrect code. Try again.' : ''}</div>
			<div className='login2-bottom'>
				<div className='login2-bottom-text'>
					<div>1</div>Open the Listery App on your main device
				</div>
				<div className='login2-bottom-text'>
					<div>2</div>Go to&nbsp;<span>Menu &gt; Add New Device</span>
				</div>
				<div className='login2-bottom-text'>
					<div>3</div>Enter the received code in the field above
				</div>
			</div>
    </div>
  );
};

export default Login2;