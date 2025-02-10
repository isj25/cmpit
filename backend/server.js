const express = require('express');
const cors = require('cors');
const { fetchSwiggyStoreId, fetchSwiggySearchResults } = require('./swiggy');
const { fetchZeptoStoreId,fetchZeptoStoreItems } = require('./zepto');
const {fetchBigBasketProducts} = require('./bigbasket');
const {getBlinkit} = require('./blinkit');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    req.requestTracker = req.headers['request-tracker'] || 'no-tracker';
    next();
});



app.post('/api/get/store', async (req, res) => {
    const { query, latitude, longitude } = req.body;
    const requestTracker = req.requestTracker;

    logger.info(`[${requestTracker}] Request received to fetch data`, { query, latitude, longitude });

    try {
        const swiggyStoreId = await fetchSwiggyStoreId(latitude, longitude);
        const zeptoStoreId = await fetchZeptoStoreId(latitude, longitude);


        const [swiggyResult, bigbasketResult,zeptoResults] = await Promise.allSettled([
            fetchSwiggySearchResults(swiggyStoreId, query),
            fetchBigBasketProducts(query),
            fetchZeptoStoreItems(query,zeptoStoreId)
        ]);

        response = {
            swiggy : swiggyResult,
            bigbasket :  bigbasketResult,
            zepto : zeptoResults
        }

        processResponse(response);
        res.json(response)
    } catch (error) {
        logger.error(`[${requestTracker}] Error fetching store data, ${ error }`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const processResponse = (response) => {
    const sortItems = (items) => {
        if (items && items.value && Array.isArray(items.value)) {
            items.value.sort((a, b) => {
                const priceA = a.offer_price || Infinity;
                const priceB = b.offer_price || Infinity;
                return priceA - priceB;
            });
        }
    };

    const limitItems = (items,limit) => {
        if (items && items.value && Array.isArray(items.value)) {
            const limitedItems = items.value.slice(0, limit);
            const remainingItems = items.value.slice(limit);
            items.value = limitedItems;
            return remainingItems;
        }
        return [];
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };
    sortItems(response.swiggy);
    sortItems(response.bigbasket);
    sortItems(response.zepto);

    const minItems = Math.min(
        response.swiggy.value.length,
        response.bigbasket.value.length,
        response.zepto.value.length,
        Number(process.env.MINIMUM_ITEMS)
    );
    response.others = [
        ...limitItems(response.swiggy,minItems),
        ...limitItems(response.bigbasket,minItems),
        ...limitItems(response.zepto,minItems)
    ];

    shuffleArray(response.others);
}

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`[${req.requestTracker}] Unhandled error, ${ err }`);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    logger.info(`Proxy server running at http://localhost:${port}`);
});