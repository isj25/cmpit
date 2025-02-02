const express = require('express');
const cors = require('cors');
const { fetchSwiggyStoreId, fetchSwiggySearchResults } = require('./swiggy');
const { fetchZeptoStoreId } = require('./zepto');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.post('/api/get/store', async (req, res) => {
    const { query, latitude, longitude } = req.body;
    logger.info('Request received to fetch store ID', { query, latitude, longitude });

    try {
        const swiggyStoreId = await fetchSwiggyStoreId(latitude, longitude);
        const zeptoStoreId = await fetchZeptoStoreId(latitude, longitude);

        const swiggyResponse = await fetchSwiggySearchResults(swiggyStoreId, query);
        res.json(swiggyResponse);
    } catch (error) {
        logger.error('Error fetching store data', { error });
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error', { error: err });
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    logger.info(`Proxy server running at http://localhost:${port}`);
});