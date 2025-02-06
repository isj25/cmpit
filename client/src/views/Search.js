import React, { useState } from 'react';
import '../css/Search.css';
import { fetchSearchResults } from '../utils/API';

const Search = ({ onSearchResults, onSearchInitiated, location }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearch = async () => {
        try {
            onSearchInitiated();
            const results = await fetchSearchResults(query, location);
            onSearchResults(results);
            // Handle the results as needed
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-container">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
                onKeyPress={handleKeyPress}
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">Search</button>
        </div>
    );
};



export default Search;