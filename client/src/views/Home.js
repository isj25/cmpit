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
            <div className="title-description">
                <h1>Quick commerce, quick savings!!!</h1>
                <p>Don't let your wallet cry – compare prices before you buy!</p>
            </div>
            {!location && (
                <div className="banner">
                    <h1>How can I search without location?</h1>
                    <p>Go to the settings of your browser,search Location and set it to "Allow".</p>
                    <p>Refresh the page, check the status of location on the top right corner</p>
                    <h1>Don't let your wallet cry – compare prices before you buy!</h1>
                </div>
            )}
            {
                location && (<Search onSearchResults={handleSearchResults} onSearchInitiated={handleSearchInitiated} location={location} />)
            }

            {loading && <div className="loader">Loading...</div>}
            {
                    !loading && searchResults.swiggy && <h3 className='top-deals'>T O P  -  D E A LS</h3>
            }
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

            {
                    !loading &&searchResults.others && <h3 className='top-deals'>C A T C H Y - D E A L S</h3>
            }
            {
                 searchResults.others && (
                    <div className="horizontal-container">
                        {!loading && searchResults.others && Array.isArray(searchResults.others) &&
                            searchResults.others.map((item, index) => (
                                <div className="container-item" key={`others-${index}`}>
                                    <Container data={item} />
                                </div>
                            ))
                        }
                    </div>
                )
            }

        </div>
    );
}

export default Home;