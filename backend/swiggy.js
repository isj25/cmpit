const fetch = require('node-fetch');
const dotenv = require('dotenv');
const logger = require('./logger');

dotenv.config();

const swiggyApiUrl = process.env.SWIGGY_API_URL;
const swiggySearchApiUrl = process.env.SWIGGY_SEARCH_API_URL;

const fetchSwiggyStoreId = async (latitude, longitude) => {
    const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,kn;q=0.8',
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://www.swiggy.com',
        'referer': 'https://www.swiggy.com/instamart',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    };
    const body = JSON.stringify({
        data: {
            lat: latitude,
            lng: longitude,
            clientId: 'INSTAMART-APP'
        }
    });

    try {
        const response = await fetch(swiggyApiUrl, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        logger.info(`Swiggy store ID: ${data.data.storeId}`);
        return data.data.storeId;
    } catch (error) {
        logger.error('Error fetching Instamart suggestions', { error });
        throw error;
    }
};


const processRequiredData = (data) => {
  const widgets = data.data ? data.data.widgets[0].data : [];
  const response = [];
  for(const widget of widgets) {
    const variations = widget.variations;
    for(const variation of variations ) {
        let item = {}
        let price = variation.price;
        item.mrp = price.mrp;
        item.offer_price = price.offer_price;
        item.title = widget.display_name;
        item.quantity = variation.quantity
        item.image = `https://media-assets.swiggy.com/swiggy/image/upload/${variation.images[0]}`;
        item.brand = 'https://img-cdn.thepublive.com/fit-in/1200x675/smstreet/media/media_files/b8hxDcPQWP4Gh1u0XvvW.jpg';
        response.push(item);
    }
  }
  //console.log(response)
  if (response.length > 10) {
    return response.slice(0, 10);
  }
  return response;
}


const fetchSwiggySearchResults = async (storeId, query) => {
    const url = `${swiggySearchApiUrl}?limit=40&pageType=INSTAMART_AUTO_SUGGEST_PAGE&storeId=${storeId}&primaryStoreId=${storeId}&query=${query}`;
    const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,kn;q=0.8',
        'content-type': 'application/json',
        'origin': 'https://www.swiggy.com',
        'referer': `https://www.swiggy.com/instamart/search?custom_back=true&query=${query}`,
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'x-build-version': '2.249.0',
        'Cookie': 'ally-on=false; bottomOffset=0; deviceId=s%3A40a422b8-c929-8ca9-73b16fb5b8.p%2FFxBIYfyIqjzjjpb0f8y8pw4k7qgrffQluMof6DWOo; genieTrackOn=false; isNative=false; openIMHP=false; platform=web; sid=s%3Aipn6a7a6-8387-4047-bbdb-93a00e0a0.BUEyJfYj6hWAtXjy2lL0TDsaXXeFKbeynIXUirwKZXo; statusBarHeight=0; strId=; subplatform=dweb; tid=s%3A1ae796d5-13cc-4391-8d17-e8e141497.u4cPikHvlEstZO%2FI5kho1xOOhfNrarW2F6lhBRIeXXc; userLocation=%7B%22lat%22%3A12.9188%2C%22lng%22%3A77.6361639%2C%22address%22%3A%22%%22id%22%3A%22%22%2C%22annotation%22%3A%22%22%2C%22nam22%22%7D; versionCode=1200'
    };
    const body = JSON.stringify({
        "facets": {},
        "sortAttribute": ""
    });

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    
        logger.info(`Swiggy search results returned ${response.status}`);
        const responseText = await response.text();
        // logger.info(`Swiggy search results: ${responseText}`);
        const data = JSON.parse(responseText);
        return processRequiredData(data);
    } catch (error) {
        logger.error(`Error fetching Swiggy search results: ${error}`);
        throw error;
    }
};

module.exports = { fetchSwiggyStoreId, fetchSwiggySearchResults };