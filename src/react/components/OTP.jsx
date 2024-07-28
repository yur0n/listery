import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

const OTP = ({ otpResult }) => {

	const [otp, setOtp] = useState('');
	if (otp.length === 6) {
		console.log('OTP!')
		otpResult(false)
		setOtp('')
	}
  return (
		<OtpInput
			value={otp}
			onChange={setOtp}
			numInputs={6}
			renderSeparator={<span>&nbsp;</span>}
			renderInput={(props) => <input autoFocus {...props} />}
			inputStyle={{
				caretColor: 'transparent',
				marginTop: '82px',
				width: '32px',
				height: '34px',
				lineHeight: '88px', // Adjust as needed
				paddingBottom: '10px', // Adjust as needed
				outline: 'none',
				border: 'none', // Remove default border
				borderBottom: '2px solid #9295a99a', // Add bottom border
				textAlign: 'center',
				fontSize: '47.21px',
				fontWeight: '600',
				// fontFamily: 'Inter',
			}}
		/>
  );
};

export default OTP;