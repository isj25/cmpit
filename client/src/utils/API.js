export const fetchStoreData = async (query,latitude, longitude) => {
    const url = 'http://localhost:5001/api/get/store';
    const body = JSON.stringify({
        latitude: latitude,
        longitude: longitude,
        query : query
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching Instamart suggestions:', error);
        throw error;
    }
};


export const fetchSearchResults = async (query, location) => {
    const result = await fetchStoreData(query,location.latitude, location.longitude);
    console.log(result);
}