chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.name === 'scan') {
    const data = getData();
    sendResponse(data);
  }
});

async function isLink(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (e) {
    return false;
  }
}

const currencySymbols = {
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'CNY',
  '₹': 'INR',
  '₽': 'RUB',
  '₴': 'UAH'
};

const markets = [byMeta, byScript, bruteForce];
const popularMarkets = { amazon, ebay, alibaba, allegro, etsy, superpharm };
Object.keys(popularMarkets).map(shop => {
  if (window.location.href.includes(`${shop}`)) markets.unshift(popularMarkets[shop])
});

function getData() {
  const data = {
		title: '',
		price: '',
		currency: '',
		description: '',
		imgUrl: '',
		url: ''
	};

  for (let i = 0; i < markets.length ; i++) {
    const infoUnparsed = markets[i]();
    if (infoUnparsed) {
      const info = { ...infoUnparsed, description: infoUnparsed.description?.slice(0, 200), title: infoUnparsed.title?.slice(0, 35) };
      for (const key in info) {
        if (info.hasOwnProperty(key) && !data[key]) {
          data[key] = info[key];
        }
      }
    }
    if (data.title && data.price && data.currency && data.description && data.imgUrl && data.url) break;
  }
  console.log(data)
  return data;
}

function byMeta() {
  const title = document.querySelector('meta[property="og:title"]')?.content;
  const price = document.querySelector('meta[property="og:price:amount"]')?.content 
    || document.querySelector('meta[property="product:price:amount"]')?.content;
  const currency = document.querySelector('meta[property="og:price:currency"]')?.content
    || document.querySelector('meta[property="product:price:currency"]')?.content;
  const description = document.querySelector('meta[property="og:description"]')?.content;
  const imgUrl = document.querySelector('meta[property="og:image"]')?.content;
  const url = window.location.href; // || document.querySelector('meta[property="og:url"]')?.content;
  return { title, price, imgUrl, currency, url, description };
}

function byScript() {
  try {
    const ldJsonScripts = document.querySelectorAll('script[type="application/ld+json"]');
    let product;

    for (const script of ldJsonScripts) {
      const scriptContent = JSON.parse(script.textContent);

      if (Array.isArray(scriptContent)) {
        for (const item of scriptContent) {
          if (item['@type'] === 'Product') {
            product = item;
            break;
          }
        }

      } else if (scriptContent['@type'] === 'Product') {
        product = scriptContent;
      } else if (scriptContent['@graph']) {
        const productGroup = scriptContent["@graph"].find(item => item["@type"] === "ProductGroup");
        if (productGroup?.hasVariant) {
          product = productGroup.hasVariant[0];
        }
      }

      if (product) {
        break;
      }
    }

    if (product) {
      console.log(product)
      const description = product.description;
      const title = product.name;
      let imgUrl = typeof product.image == 'string' 
        ? product.image 
        : Array.isArray(product.image) 
          ? product.image?.[0].contentURL || product.image[0]
          : product.image?.url || product.image?.contentURL;
      if (imgUrl && !imgUrl?.includes('http')) imgUrl = 'https:' + imgUrl;
      const offers = Array.isArray(product.offers) ? product.offers[0] : product.offers
      const price = offers?.price || offers?.lowPrice || offers?.priceSpecification?.price;
      const currency = offers?.priceCurrency || offers?.priceSpecification?.priceCurrency;
      const url = window.location.href; // offers?.url;
      return { title, price, imgUrl, currency, url, description };
    } else {
      return null;
    }

  } catch (e) {
    console.log(e);
    return null;
  }
}

function bruteForce() {
  try {
    const title = document.head.querySelector('title')?.innerText;
    const imgUrl = document.querySelector('img').src;
  
    let price = '';
    const priceEls = document.body.querySelectorAll('*[class*="price"]');
    priceEls.forEach(el => {
      const priceText = el.innerText
      if (/\d/.test(priceText)) {
        price = priceText.replace(/[^0-9.,]/g, '');
        return;
      }
    });
  
    return { title, price, imgUrl }
  } catch (e) {
    console.log(e);
    return null;
  }
}

function ebay() {
  try {
    const productDataContainer = document.querySelector('.vim.x-seo-structured-data');
  
    if (productDataContainer) {
      const scriptElement = productDataContainer.querySelector('script[type="application/ld+json"]');
      
      if (scriptElement) {
        const scriptText = scriptElement.textContent;
        const productData = JSON.parse(scriptText);
  
        const title = productData.name;
        const imgUrl = productData.image;
        const price = productData.offers.price;
        const currency = productData.offers.priceCurrency;
        const url = productData.offers.url || window.location.href;
        const description = '';
  
        return { title, price, imgUrl, currency, url, description };
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

function amazon() {
  try {
    const title = document.getElementById('productTitle')?.innerText;
    const price1 = document.querySelector('#apex_desktop .a-price-whole')?.innerText;
    const price2 = document.querySelector('#apex_desktop .a-price-fraction')?.innerText;
    const imgUrl = document.querySelector('#main-image-container #imgTagWrapperId img')?.src || '';
    const priceSymbol = document.querySelector('#apex_desktop .a-price-symbol')?.innerText;
    const currency = currencySymbols[priceSymbol] || '';
    const url = window.location.href;
    const ul = document.querySelectorAll('#feature-bullets span');
    let descrRaw = '';
    ul?.forEach(span => {
      descrRaw += span.innerText + '\n\n';
    })
    const description = descrRaw?.trim();
  
    return { title, price: price1 + price2, imgUrl, currency, url, description };
  } catch (e) {
    console.log(e);
    return null;
  }
 
}

function alibaba() {
  try {
    const priceDiv = document.querySelector('.product-price');
    const price = priceDiv?.querySelector('span')?.innerText.replace(/[^0-9.,]/g, '');
    const currency = document.querySelector('[data-tnhkey="Language-Text"]')?.innerText.slice(-3);
    return { price, currency }
  } catch (e) {
    console.log(e);
    return null;
  }
}

function allegro() {
  try {
    const scripts = document.head.querySelectorAll('script');
    const targetScript = Array.from(scripts).find(script => script.textContent.includes('dataLayer'));
    const dataLayer = targetScript.textContent.replace('dataLayer=', '');
    const data = JSON.parse(dataLayer);
    const price = data[0].price;
    const currency = data[0].currency;
    return { price, currency }
  } catch (e) {
    console.log(e);
    return null;
  }
}

function etsy() {
  try {
    const data = byScript();
    const price = document.querySelector('.wt-text-title-larger.wt-mr-xs-1')?.textContent.trim().replace(/[^0-9.,]/g, '');
    data.price = price;
  } catch (e) {
    console.log(e)
  }
  return data;
}

function superpharm() {
  try {
    const data = byMeta();
    const price = document.querySelector('span[data-price-type="finalPrice"]')?.dataset.priceAmount;
    const description = document.querySelector('meta[name="description"]')?.content;
    data.price = price;
    data.description = description;
  } catch (e) {
    console.log(e)
  }
  return data;
}

// function ebay() {
//   const title = document.querySelector('.x-item-title__mainTitle .ux-textspans.ux-textspans--BOLD')?.innerText
//   console.log(title)
//   const price = document.querySelector('.x-price-primary .ux-textspans')?.innerText
//   console.log(price)
//   const imgUrl = document.querySelector('.vim .x-photos img')?.src
//   console.log('IMAGE: ' + imgUrl)
//   if (!title || !price) return null
//   return { title, price, imgUrl }
// }