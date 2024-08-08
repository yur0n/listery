// chrome.runtime.onInstalled.addListener(async ({ reason }) => {
	
// });

import axios from "axios";
import currencies from "../utils/currencies.js";

const api = axios.create({
  baseURL: process.env.API_URL,
});

chrome.runtime.onStartup.addListener(() => { 
	checkToken().then(updateUser);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	switch (message.name) {
		case 'mainMenu':
			checkToken().then(updateLists).then(sendResponse);
			return true;
		case 'loginUser':
			loginUser(message).then(sendResponse);
			return true;
		case 'sendWish':
			sendWish(message).then(sendResponse);
			return true;
	}

});

async function loginUser(message) {
	await new Promise(res => setTimeout(res, 1000))

	const data = {
		code: message.data,
		meta: {
			deviceName: 'Chrome',
			appVersion: 'Listery v1.0.0',
		},
		type: 'BROWSER'
	};

	const status = await api.post('/devices/activate', data)
	.then(async res => {
		if (res.data.refresh) {
			const { token, refresh, expire, user: { username, id, photo: photoUrl } } = res.data;
			const photo = photoUrl || 'https://api.listery.app/public/1723100250545-user_placeholder.png'
			await chrome.storage.local.set({ refresh, token, expire, username, id, photo });
			return true;
		} else {
			return false;
		}
	})
	.catch(e => {
		console.log(e);
		return false;
	});

	return status;
}

async function checkToken() {
  try {
		const { userLoggedIn, expire, refresh, token } = await chrome.storage.local.get(['userLoggedIn', 'expire', 'refresh', 'token'])
		if (!userLoggedIn) return '';
		const currentTime = Date.now() + (3 * 60 * 1000) // add 3 minutes
		if (expire && (expire * 1000) < currentTime) {
			return refreshToken(refresh);
		}

		return token;
  } catch (e) {
    console.error('Error refreshing token:', e);
		return '';
  }
}

async function refreshToken(refresh_token) {
	try {
		const { data } = await api.get('/user/refresh', {
			headers: {
				Authorization: `Bearer ${refresh_token}`
			}
		});
		if (!data.refresh) throw new Error('Refresh request failed!');
		const { token, refresh, expire, user: { username, id, photo } } = data; 
		await chrome.storage.local.set({refresh, token, expire, username, id, photo})
		return token;
	} catch (e) {
		console.log(e)
		await chrome.storage.local.set({ userLoggedIn: false });
		return ''
	}
}

async function updateUser(token) {
	try {
		if (!token) return;
		const { data: { photo, username } } = await api.get(`/user/${id}` , { 
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		if (photo && username) {
			chrome.storage.local.set({username, photo});
		}
	} catch (e) {
		console.log(e);
	}
}

async function updateLists(token) {
	try {
		if (!token) return;
		const { data } = await api.get('/lists/aggregate' , { 
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		const lists = [];
		data.map(list => {
			lists.push({ id: list._id, name: list.name })
		})
		chrome.storage.local.set({lists});
		return true;
	} catch (e) {
		console.log(e);
	}
}

async function sendWish(message) {

	const {
		title,
		wishlist,
		price,
		currency,
		description,
		imgUrl,
		url
	} = message.data;

	const data = {
		name: title,
		lists: [wishlist],
		images: imgUrl ? [imgUrl] : [],
		description: description,
		link: url,
		price: {
			currencySymbol: currencies[currency] || '$',
			value: price.trim().replace(/[^0-9.]/g, ''),
			currency: {
				symbol: currencies[currency] || '$',
				name: currency
			}
		}
	};

	const token = await checkToken()
	if (!token) return false;
	const status = await api.post('/wishes', data, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	.then(res => true)
	.catch(e => {
		console.log(e);
		return false;
	});

	return status
}