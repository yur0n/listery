import { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';

const OTP = ({ otpResult }) => {
	const [otp, setOtp] = useState('');
	const [isInputDisabled, setIsInputDisabled] = useState(false);

  useEffect(() => {
    if (otp.length === 6) {
      setIsInputDisabled(true);
      chrome.runtime.sendMessage({ name: 'loginUser', data: otp }, (response) => {
				otpResult(response);
				setIsInputDisabled(false);
				setOtp('');
			});
			setOtp('******');
    } else {
      setIsInputDisabled(false);
    }
  }, [otp]);

  return (
		<OtpInput
			shouldAutoFocus={true}
			value={otp}
			onChange={setOtp}
			numInputs={6}
			renderSeparator={<span>&nbsp;</span>}
			renderInput={(props) => <input disabled={isInputDisabled} {...props} />}
			inputStyle={{
				caretColor: 'transparent',
				width: '32px',
				lineHeight: '88px',
				paddingBottom: '8px',
				outline: 'none',
				border: 'none',
				borderBottom: '2px solid #9295a99a',
				textAlign: 'center',
				fontSize: '47.21px',
				fontWeight: '600',
				fontFamily: 'Inter',
				userSelect: 'none',
			}}
			containerStyle={{
				marginTop: '80px',
				height: '46px',
				alignItems: 'normal'
			}}
		/>
  );
};

export default OTP;