import React from 'react'

import { useState, useEffect } from 'react';

import RefreshSvg from '../logos/wish-refresh.svg'
import TitleSvg from '../logos/wish_title.svg'
import ListSvg from '../logos/wish_list.svg'
import PriceSvg from '../logos/wish_price.svg'
import DescriptionSvg from '../logos/wish_description.svg'
import Dropdown from './Dropdown/components/Dropdown/Dropdown';
import DropdownItem from "./Dropdown/components/DropdownItem/DropdownItem";

function Whish() {
	const [newWhish, setNewWish] = useState({
		title: '',
		whishlist: '',
		price: '',
		currency: '',
		description: '',
		imgUrl: '',
		url: ''
	})

	const [whishlist, setWhishlist] = useState('My whishes');
	const items = ['My wishlist', 'Best whishes', 'My custome list']; 

	const [data, setData] = useState({ title: '', price: '' });

	const updateWhish = (key, e) => {
		setNewWish({...newWhish, [key]: e.target.value})
	}

	useEffect(() => {
		scan()
  }, []);

  const scan = async () => {
    // Get active tab
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const activeTab = tabs[0];
    // Get the response
    const tabResp = await chrome.tabs.sendMessage(activeTab.id, 'something');
    setNewWish({...newWhish, ...tabResp});
  };

	return (
		<>
			<div className='wish-refresh'>
						<RefreshSvg /><span onClick={scan}>Refresh item details</span>
			</div>
			<div className='wish-info'>
				<div className='wish-title' style={{ marginLeft: '-2px' }}>
					<TitleSvg /><input type="text" value={newWhish.title} onChange={(e) => updateWhish('title', e)} />
				</div>
				<div className='wish-list'>
					<ListSvg />
					<Dropdown
						buttonText={whishlist}
						content={
							<>
								{items.map((item, id) => (
									<DropdownItem onClick={(e) => setWhishlist(e.target.innerText)} key={id}>{item}</DropdownItem>
								))}
							</>
						}
					/>
				</div>
				<div className='wish-price'>
					<PriceSvg /><input className='input1' type="text" value={newWhish.price} onChange={(e) => updateWhish('price', e)} /><input className='input2' type="text"  onChange={(e) => updateWhish('currency', e)} />
				</div>
				<div className='wish-description'>
					<DescriptionSvg /><textarea  onChange={(e) => updateWhish('description', e)} />
				</div>
				<div className='wish-image'>

				</div>
			</div>
		</>
	)
}

export default Whish