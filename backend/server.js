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
        res.json(response)
    } catch (error) {
        logger.error(`[${requestTracker}] Error fetching store data, ${ error }`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`[${req.requestTracker}] Unhandled error, ${ err }`);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    logger.info(`Proxy server running at http://localhost:${port}`);
});