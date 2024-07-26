import {useState} from 'react';

const App = () => {
  const [data, setData] = useState({ title: '', price: '' });

  const scan = async () => {
    // Get active tab
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const activeTab = tabs[0];
    // Get the response
    const tabResp = await chrome.tabs.sendMessage(activeTab.id, 'something');
    setData(tabResp);
  };

  return (
    <main>
			<button onClick={scan}>SCAN</button>
      <h2>Title: {data.title}</h2>
      <h2>Price: {data.price}</h2>
      <h2>Somethong: {data.extra}</h2>
    </main>
  );
};
export default App;