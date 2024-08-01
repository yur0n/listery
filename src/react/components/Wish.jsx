import { useState, useEffect } from 'react';

import RefreshSvg from '../icons/wish_refresh.svg'
import ClearSvg from '../icons/wish_clear.svg'
import TitleSvg from '../icons/wish_title.svg'
import ListSvg from '../icons/wish_list.svg'
import PriceSvg from '../icons/wish_price.svg'
import DescriptionSvg from '../icons/wish_description.svg'
import LoaderStar from '../icons/loader_star.svg'
import Dropdown from './Dropdown/Dropdown';
import DropdownItem from "./Dropdown/DropdownItem";

function Wish({ chooseView }) {
	const [lists, setLists] = useState([{ id: '', name: '' }]);
	const [isLoading, setIsLoading] = useState(false);
	const [wishlist, setWishlist] = useState({ id: '', name: '' });
	const [newWish, setNewWish] = useState({
		title: '',
		wishlist: '',
		price: '',
		currency: '',
		description: '',
		imgUrl: '',
		url: ''
	})

	async function updateWish(key, value) {
		setNewWish(prevState => ({ ...prevState, [key]: value }))
	}

	async function sendWish() {
		if (!newWish.title) return;
		setIsLoading(true);
		chrome.runtime.sendMessage({ name: 'sendWish', data: newWish }, (response) => {
			if (response) {
				setIsLoading(false);
				chooseView('success')
				// new Promise(res => setTimeout(() => {
				// 	chooseView('main');
				// 	res();
				// }, 2500))
			}
		});
	}

	useEffect(() => {
		(async function() {
			await scan(null, true);
			const data = await chrome.storage.local.get(['lists']);
			const updateLists = data.lists;
			setWishlist(updateLists[0]);
			setLists(updateLists);
			setNewWish(prevState => ({ ...prevState, wishlist: updateLists[0].id }))
		})()

  }, []);

	async function scan() {
		setIsLoading(true);
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const activeTab = tabs[0];
    const data = await chrome.tabs.sendMessage(activeTab.id, { name: 'scan' }).catch(console.log);
		await new Promise(res => setTimeout(res, 1000))
    setNewWish({...newWish, ...data});
		setIsLoading(false);
  };

	return (
		<>
			{isLoading && (
				<div className='scanning-overlay' >
					<LoaderStar className='cirlce-loader-star' />
					<div className='cirlce-loader'>
						
					</div>
				</div>
			)}
			<div className='wish-refresh'>
						<RefreshSvg /><span onClick={scan}>Refresh item details</span>
			</div>
			<div className='wish-info'>
				<div className='wish-title' style={{ marginLeft: '-2px' }}>
					<TitleSvg /><input placeholder='Add title' type="text" value={newWish.title} onChange={(e) => updateWish('title', e.target.value)} />
				</div>
				<div className='wish-list'>
					<ListSvg />
					<Dropdown
						buttonText={wishlist.name}
						content={
							<>
								{lists.map(list => (
									<DropdownItem 
										onClick={() => {
											setWishlist({ id: list.id, name: list.name })
											updateWish('wishlist', list.id)
										}} 
										key={list.id}>
										{list.name}
									</DropdownItem>
								))}
							</>
						}
					/>
				</div>
				<div className='wish-price'>
					<PriceSvg />
					<input 
						placeholder='00.00'
						className='input1' 
						type="text" 
						value={newWish.price} 
						onChange={(e) => updateWish('price', e.target.value)} 
					/>
					<input 
						placeholder='USD'
						className='input2'
						type="text" 
						value={newWish.currency}
						onChange={(e) => updateWish('currency', e.target.value)} />
				</div>
				<div className='wish-description'>
					<DescriptionSvg /><textarea placeholder='Add description' value={newWish.description} onChange={(e) => updateWish('description', e.target.value)} />
				</div>
				<div>
					{
						newWish.imgUrl 
						? 
						<div className='wish-image-container wish-image-full'>
							<ClearSvg className='wish-image-clear' onClick={() => updateWish('imgUrl', '')}/>
							<img src={newWish.imgUrl} />
						</div>
						:
						<div className='wish-image-container wish-image-empty' />
					}
				</div>
			</div>
			<div className={newWish.title ? 'send-wish-btn' : 'send-wish-btn disabled' } onClick={sendWish}>
					Add to wishlist
			</div>
		</>
	)
}

export default Wish