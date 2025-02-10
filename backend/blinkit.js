const fetch = require('node-fetch');
const logger = require('./logger');

const getBlinkit = async (query, latitude, longitude) => {
    logger.info(`latitude: ${latitude}, longitude: ${longitude}`);
    logger.info(`Request received to fetch Blinkit data for query: ${query}`);
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Accept-Language", "en-US,en;q=0.5");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br, zstd");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("lat", "12.9188883");
    myHeaders.append("lon", "77.6361646");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Cookie", "__cf_bm=39Pjq7aBgQmIFYr3.xAF35B1QqVrBT_QH1JpYk9rM9E-1739206010-1.0.1.1-J1SgH_ZlVBBt3uF6_XD8Kjc9BnrRt.kQDkXnqgTrEKn53gzgHXtLdruGFEfwJ5PZ9ywIIbld5zdj9H0MVQpg9A; __cfruid=619052f0b79cc167cf4f56b4a955c4f70d0415b0-1739014568; _cfuvid=drzpqAl4LtzLBsaop_T5ZOTfujijFOZtKziSyKcMHsw-1739014568469-0.0.1.1-604800000");

    const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
    };

fetch(`https://blinkit.com/v6/search/products?start=0&size=20&search_type=7&q=${query}`, requestOptions)
  .then((response) => console.log(response.status))
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
    
};

module.exports = { getBlinkit };