chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
    
    const { title, price } = getData();
    const extra = msg;
    // h1.appendChild(text);
    // document.body.appendChild(h1);
    sendResponse({ title, price, extra });
  }
);

function getData() {
  let data;
  for (let i = 0; !data || i < 2 ; i++) {
    data = markets[i]();
    if (data) break;
  }
  if (!data) data = { title: 'undef', price: 'undef' }
  return data;
}

const markets = {
  0: amazon,
  1: ebay,
}

function amazon() {
  const title = document.getElementById('productTitle');
  console.log(title)
  const price1 = document.querySelector('.a-price-whole');
  console.log(price1)
  const price2 = document.querySelector('.a-price-fraction')
  if (!title || !price1) return null
  return { title: title.innerText, price: price1.innerText + price2.innerText }
}

function ebay() {
  const title = document.querySelector('.x-item-title__mainTitle .ux-textspans.ux-textspans--BOLD')
  console.log(title)
  const price = document.querySelector('.x-price-primary .ux-textspans')
  console.log(price)
  if (!title || !price) return null
  return { title: title.innerText, price: price.innerText }
}

