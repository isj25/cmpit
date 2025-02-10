import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import Search from './Search';
import Container from '../utils/Container';

function Home() {
    const [searchResults, setSearchResults] = useState({});
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    const askLocation = () => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    const handleSearchResults = (results) => {
        setSearchResults(results);
        setLoading(false); // Set loading to false when results are set
    };

    const handleSearchInitiated = () => {
        setLoading(true); // Set loading to true when search is initiated
    };

    return (
        <div className="container">
            <div className={`location ${location ? 'location-set' : 'location-unset'}`} onClick={askLocation}>
                {location ? 'Location Set' : 'Location Unset'}
            </div>
            <h1>Compare it freely</h1>
            <p>because it is your money</p>
            {!location && <p className='location-error'>Please set your location to get results.</p>}
            <Search onSearchResults={handleSearchResults} onSearchInitiated={handleSearchInitiated} location={location} />
            {loading && <div className="loader">Loading...</div>}
            <div className="results-wrapper">
            
                <div className="results-container">
                    
                    {!loading && searchResults.swiggy && Array.isArray(searchResults.swiggy.value) &&
                        searchResults.swiggy.value.map((item, index) => (
                            <Container key={`swiggy-${index}`} data={item} />
                        ))
                    }
                </div>
                <div className="results-container">
                    {!loading && searchResults.bigbasket && Array.isArray(searchResults.bigbasket.value) &&
                        searchResults.bigbasket.value.map((item, index) => (
                            <Container key={`bb-${index}`} data={item} />
                        ))
                    }
                </div>
                <div className="results-container">
                    {!loading && searchResults.zepto && Array.isArray(searchResults.zepto.value) &&
                        searchResults.zepto.value.map((item, index) => (
                            <Container key={`zepto-${index}`} data={item} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Home;