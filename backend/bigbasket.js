require('dotenv').config();
const fetch = require('node-fetch');
const logger = require('./logger'); // Assuming you have a logger module

const fetchBigBasketProducts = async (query) => {
    const url = `${process.env.BIGBASKET_API_URL}?type=ps&slug=${query}&page=${1}&bucket_id=${92}`;
    const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,kn;q=0.8',
        'content-type': 'application/json',
        'cookie': 'x-entry-context-id=100; x-entry-context=bb-b2c; _bb_locSrc=default; x-channel=web; _bb_bhid=; _bb_nhid=1723; _bb_vid=NTgwODUyMDg2MDU2NTEzNTE4; _bb_dsevid=; _bb_dsid=; _bb_cid=1; csrftoken=LJ4ZKp6H3Ge0vu307hBL0ELbuf0KZVVpZho3L3L7RAkM7psRr9mK0uPtKPPHO3aI; _bb_home_cache=617ea33f.1.visitor; bb2_enabled=true; ufi=1; jarvis-id=c7d98ef6-ee0b-4617-affc-df3c790243f8; _gcl_au=1.1.1015068049.1738688684; bigbasket.com=f8e120d3-fd8a-4e66-bf38-e8ab329f0aee; _fbp=fb.1.1738688684111.156738284846302290; adb=0; _bb_aid="Mjk5NzE1NzQ2Mw=="; _bb_lat_long="MTIuOTEzNzYzNHw3Ny42MzcyNzc3OTk5OTk5OQ=="; _bb_bb2.0=1; is_global=0; _bb_addressinfo=MTIuOTEzNzYzNHw3Ny42MzcyNzc3OTk5OTk5OXxTZWN0b3IgNnw1NjAxMDJ8QmVuZ2FsdXJ1fDF8ZmFsc2V8dHJ1ZXx0cnVlfEJpZ2Jhc2tldGVlcg==; _bb_pin_code=560102; _is_tobacco_enabled=0; _is_bb1.0_supported=0; _bb_cda_sa_info=djIuY2RhX3NhLjEwMC4xNDkxMCwxNDkyNA==; is_integrated_sa=1; csurftoken=mwAi8Q.NTgwODUyMDg2MDU2NTEzNTE4.1738858625414.TMltVV1fEUiPDUcrRAVICUt4BKba6ftc/Uk5fp9rY0Y=; ts=2025-02-06%2021:47:06.752; _bb_sa_ids=14910%2C14924; _gcl_aw=GCL.1738858627.CjwKCAiA2JG9BhAuEiwAH_zf3pE8OsJq9SbZqsRNyiH5A6zXWEEfrJdCo3HucmMT5nQ86KqLdsn-_xoC3qMQAvD_BwE; _gcl_gs=2.1.k1$i1738858625$u160754478; _gid=GA1.2.1960097548.1738858627; _gac_UA-27455376-1=1.1738858627.CjwKCAiA2JG9BhAuEiwAH_zf3pE8OsJq9SbZqsRNyiH5A6zXWEEfrJdCo3HucmMT5nQ86KqLdsn-_xoC3qMQAvD_BwE; _gat_UA-27455376-1=1; _ga=GA1.1.1723022275.1738688684; _ga_FRRYG5VKHX=GS1.1.1738858627.2.0.1738858627.60.0.0; csurftoken=mwAi8Q.NTgwODUyMDg2MDU2NTEzNTE4.1738858625414.TMltVV1fEUiPDUcrRAVICUt4BKba6ftc/Uk5fp9rY0Y=',
        'dnt': '1',
        'priority': 'u=1, i',
        'referer': 'https://www.bigbasket.com/ps/?q=harpic&nc=as',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'x-channel': 'BB-WEB',
        'x-tracker': '05ddf566-a49c-412b-9dfb-d5161dc60d45'
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        logger.info(`BigBasket Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        //logger.info(`BigBasket response: ${JSON.stringify(data)}`);

        const productArray = data.tabs[0].product_info.products;
        const responseArray = [];
        for(const product of productArray) {
            let responseItem = {}
            responseItem.title = product.desc;
            responseItem.mrp = product.pricing.discount.mrp;
            responseItem.offer_price = product.pricing.discount.subscription_price;
            responseItem.image = product.images[0].l
            responseItem.quantity = product.w
            responseItem.brand = "https://content3.jdmagicbox.com/v2/comp/delhi/y1/011pxx11.xx11.200704193414.f8y1/catalogue/bigbasket-noida-delhi-online-shopping-websites-for-grocery-5j1qwtvxdu.jpg";
            responseArray.push(responseItem);
        }

        // logger.info(`BigBasket response: ${JSON.stringify(respose)}`);
        if(responseArray.length > 15) {
            return responseArray.slice(0, 15);
        }
        return responseArray;
    } catch (error) {
        logger.error('Error fetching BigBasket products:', error);
        throw error;
    }
};

module.exports = { fetchBigBasketProducts };