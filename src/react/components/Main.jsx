import {useState, useEffect} from 'react';

import Whish from './Whish'

const Main = ({ chooseView }) => {


	const [user, setUser] = useState({ avatarUrl: '', name: '' });




  // useEffect(() => {
	// 	const userInfo = chrome.storage.local.get(['user']).then((result) => {
	// 		console.log(result);
	// 		return result
	// 	});
	// 	if (!userInfo.avatarUrl || !userInfo.name) {
	// 		fetch('https://your-api-endpoint/user/avatar')
  //     .then(response => response.json())
  //     .then(data => setUser({ avatarUrl: data.avatarUrl, name: data.name}))
  //     .catch(error => console.error('Error fetching user:', error));
	// 	} else {
	// 		setUser(userInfo);
	// 	}
  // }, []);

  return (
    <div className='main-main'>
			<div className='new-wish'>
				<div className='user-info'>
					{/* {user.avatarUrl && (
						<img
							src={user.avatarUrl}
							alt="User Avatar"
							className="user-avatar"
							width={57}
							height={57}
							style={{ borderRadius: '50%' }}
						/>
					)} */}
					<img
						src={'https://i.ibb.co/b7DfDLg/avatar.png'}
						alt="User Avatar"
						className="user-avatar"
						width={57}
						height={57}
						style={{ borderRadius: '50%' }}
					/>
					<span>
						Leoo
					</span>
				</div>
				<Whish />
			</div>
			<div className='main-main-bottom-btn'>
					Add to wishlist
			</div>

    </div>
  );
};

export default Main;