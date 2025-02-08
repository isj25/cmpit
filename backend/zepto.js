const fetch = require('node-fetch');
const dotenv = require('dotenv');
const logger = require('./logger');

dotenv.config();

const zeptoApiUrl = process.env.ZEPTO_API_URL;

const processZeptoStoreItems = (data) => {

    try{

    }catch(error){
    }
    let response = [];
    let layouts = data?.layout
    let i = 1;
    for(layout of layouts){
        if(i===1){
            i++;
            continue;
            
        }
        let items = layout?.data?.resolver?.data?.items;
        items = Array.isArray(items) ? items : [items];
        for(item of items){
            let responseItem = {}
            let productResponse = item?.productResponse
            responseItem.title = productResponse?.product?.name;
            responseItem.mrp = productResponse?.mrp /100;
            responseItem.offer_price = productResponse?.sellingPrice/100;
            let quantity = productResponse?.productVariant?.packsize;
            if(quantity){
               let unit = productResponse?.productVariant?.unitOfMeasure;
            
                if(unit){
                    unit = unit.toLowerCase();
                }

                quantity = quantity + " " + unit
                responseItem.quantity = quantity;
            }

            let images = productResponse?.productVariant?.images;
            let start = 1;
            images = Array.isArray(images) ? images : [images];
            for(image of images){
                if(start>1){
                    break;
                }
                let path = "https://cdn.zeptonow.com/production/" +image?.path;
                responseItem.image = path;
                start++;
            }
            responseItem.brand = "https://thehardcopy.co/wp-content/uploads/Zepto-Featured-Image-Option-2.png";
            response.push(responseItem);
        }

    }
    if(response.length >10){
        return response.slice(0,10);
    }

    return response;
}

const fetchZeptoStoreItems = async (query,storeId) => {
    logger.info(`Fetching Zepto store items for query: ${query}, storeId: ${storeId}`);
    const url = process.env.ZEPTO_ITEMS_URL;
    const headers = {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,kn;q=0.8',
        'app_sub_platform': 'WEB',
        'app_version': '12.43.0',
        'appversion': '12.43.0',
        'auth_revamp_flow': 'v2',
        'compatible_components': 'CONVENIENCE_FEE,RAIN_FEE,EXTERNAL_COUPONS,STANDSTILL,BUNDLE,MULTI_SELLER_ENABLED,PIP_V1,ROLLUPS,SCHEDULED_DELIVERY,SAMPLING_ENABLED,ETA_NORMAL_WITH_149_DELIVERY,ETA_NORMAL_WITH_199_DELIVERY,HOMEPAGE_V2,NEW_ETA_BANNER,VERTICAL_FEED_PRODUCT_GRID,AUTOSUGGESTION_PAGE_ENABLED,AUTOSUGGESTION_PIP,AUTOSUGGESTION_AD_PIP,BOTTOM_NAV_FULL_ICON,COUPON_WIDGET_CART_REVAMP,DELIVERY_UPSELLING_WIDGET,MARKETPLACE_CATEGORY_GRID,NO_PLATFORM_CHECK_ENABLED_V2,SUPER_SAVER:1,SUPERSTORE_V1,PROMO_CASH:0,24X7_ENABLED_V1,TABBED_CAROUSEL_V2,NEW_ROLLUPS_ENABLED,RERANKING_QCL_RELATED_PRODUCTS,PLP_ON_SEARCH,PAAN_BANNER_WIDGETIZED,ROLLUPS_UOM,DYNAMIC_FILTERS,PHARMA_ENABLED,AUTOSUGGESTION_RECIPE_PIP,SEARCH_FILTERS_V1,QUERY_DESCRIPTION_WIDGET,MEDS_WITH_SIMILAR_SALT_WIDGET,NEW_FEE_STRUCTURE,NEW_BILL_INFO,RE_PROMISE_ETA_ORDER_SCREEN_ENABLED,SUPERSTORE_V1,MANUALLY_APPLIED_DELIVERY_FEE_RECEIVABLE,MARKETPLACE_REPLACEMENT,ZEPTO_PASS,ZEPTO_PASS:1,ZEPTO_PASS:2,ZEPTO_PASS_RENEWAL,CART_REDESIGN_ENABLED,SHIPMENT_WIDGETIZATION_ENABLED,TABBED_CAROUSEL_V2,24X7_ENABLED_V1,PROMO_CASH:0,HOMEPAGE_V2,SUPER_SAVER:1,NO_PLATFORM_CHECK_ENABLED_V2',
        'content-type': 'application/json',
        'cookie': '_gcl_au=1.1.1125417440.1738079683; _fbp=fb.1.1738079683393.818405825544472272; _ga=GA1.1.1156628264.1738079683; _ga_52LKG2B3L1=GS1.1.1738855424.4.0.1738855424.60.0.457460698',
        'device_id': '1abb032e-94e5-4cee-83f2-a872d557a705',
        'deviceid': '1abb032e-94e5-4cee-83f2-a872d557a705',
        'dnt': '1',
        'marketplace_type': 'ZEPTO_NOW',
        'origin': 'https://www.zeptonow.com',
        'platform': 'WEB',
        'priority': 'u=1, i',
        'referer': 'https://www.zeptonow.com/',
        'request_id': '5d9612cd-30a5-468e-b5a7-a4bc4cb56c00',
        'requestid': '5d9612cd-30a5-468e-b5a7-a4bc4cb56c00',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'session_id': 'ca8c4206-f956-497b-a380-bdcdd7e416ba',
        'sessionid': 'ca8c4206-f956-497b-a380-bdcdd7e416ba',
        'store_etas': '{"7e5a1821-59ed-4d8a-8431-a3705afb22d2":8,"3bf7d17f-4fa3-481d-b14d-66ca5c4f14da":21}',
        'store_id': `${storeId}`,
        'store_ids': `${storeId}`,
        'storeid': `${storeId}`,
        'tenant': 'ZEPTO',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'x-without-bearer': 'true',
        'x-xsrf-token': 'zjTWD0G4NaUEu2hDxwP_a:olemYsSl887xMnT3IEApvwtktQA.ruQCZxoOOWHCdFfl314RVukaBwDn5zN6S3xW7h9hb6M'
    };

    //logger.info(`Zepto headers: ${JSON.stringify(headers)}`);
    logger.info(`Fetching Zepto store items for query: ${query}, storeId: ${storeId}`);

    const body = JSON.stringify({
        query: query,
        pageNumber: 0,
        intentId: "c3084117-ab0b-4380-bc8c-42d7f872a1bf",
        mode: "AUTOSUGGEST"
    }, null, 0);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        logger.info(`Zepto store items response status: ${response.status}`);
        if (!response.ok) {
            log.error(`Network response was not ok for zepto ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return processZeptoStoreItems(data);
    } catch (error) {
        logger.error(`Error fetching Zepto store items: ${error}`);
        throw error;
    }
 };





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





module.exports = { fetchZeptoStoreId,fetchZeptoStoreItems };