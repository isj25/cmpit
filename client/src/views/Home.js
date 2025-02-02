import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import Search from './Search';
import Container from '../utils/Container';

function Home() {
    const [searchResults, setSearchResults] = useState({});
    const [location, setLocation] = useState(null);

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

    const handleSearchResults = (results) => {
        setSearchResults(results);
    };

    return (
        <div className="container">
            <div className={`location ${location ? 'location-set' : 'location-unset'}`}>
                {location ? 'Location Set' : 'Location Unset'}
            </div>
            <h1>Compare it freely</h1>
            <p>because it is your money</p>
            {!location && <p>Please set your location to get better results.</p>}
            <Search onSearchResults={handleSearchResults} location={location} />
            <div className="results-container">
                {searchResults.swiggy && Array.isArray(searchResults.swiggy) &&
                    searchResults.swiggy.map((item, index) => (
                        <Container key={'swiggy'+index} data={item} />
                    ))
                }

                {searchResults.swiggy && Array.isArray(searchResults.swiggy) &&
                    searchResults.swiggy.map((item, index) => (
                        <Container key={'zepto'+index} data={item} />
                    ))
                }
            </div>
        </div>
    );
}

export default Home;