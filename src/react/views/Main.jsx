import {useState, useEffect} from 'react';

import Wish from '../components/Wish'

const Main = ({ chooseView }) => {
	const [user, setUser] = useState({ 
		username: '', 
		photo: '',
	});

  useEffect(() => {
		(async function() {
			chrome.storage.local.get(['username', 'photo']).then(setUser)
			await chrome.runtime.sendMessage({ name: 'mainMenu' })
		})()
		
  }, []);

  return (
    <div className='main-main'>
			<div className='new-wish'>
				<div className='user-info'>
					<img
						src={user.photo}
						className='user-avatar'
						width={57}
						height={57}
						style={{ borderRadius: '50%', userSelect: 'none' }}
					/>
					<span>
						{user.username}
					</span>
				</div>
				<Wish chooseView={chooseView} />
			</div>
    </div>
  );
};

export default Main;