const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const zeptoApiUrl = process.env.ZEPTO_API_URL;

const fetchZeptoStoreId = async (latitude, longitude) => {
    const url = `${zeptoApiUrl}?latitude=${latitude}&longitude=${longitude}&page_type=HOME&version=v2&show_new_eta_banner=false&page_size=10`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Referer': 'https://www.zeptonow.com/',
        'appVersion': '12.30.0',
        'platform': 'WEB',
        'app_version': '12.30.0',
        'app_sub_platform': 'WEB',
        'tenant': 'ZEPTO',
        'Origin': 'https://www.zeptonow.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Connection': 'keep-alive'
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        //console.log(data);
        const storeId = data.storeServiceableResponse?.storeId || data.storeServiceableResponseV2?.[0]?.storeId;
        return storeId;
    } catch (error) {
        console.error('Error fetching Zepto data:', error);
        throw error;
    }
};

module.exports = { fetchZeptoStoreId };