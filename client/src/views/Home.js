import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import Search from './Search';
import SwiggyContainer from '../utils/SwiggyContainer';

function Home() {
    const [searchResults, setSearchResults] = useState({});
    const [location, setLocation] = useState(null);
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    //console.log(position);
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
            <Search onSearchResults={handleSearchResults} location={location} />
            <div className="results-container">
            {searchResults.swiggy && searchResults.swiggy.data && searchResults.swiggy.data.widgets[0] &&
                    searchResults.swiggy.data.widgets[0].data.map((item, index) => (
                        <SwiggyContainer key={index} data={item} />
                    ))
                }
            </div>
        </div>
    );
}

export default Home;