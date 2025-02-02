import React from 'react';
import PropTypes from 'prop-types';
import '../css/SwiggyContainer.css';

const SwiggyContainer = ({ data }) => {
    const { display_name, variations } = data;
    const imageUrl = variations[0].images.length > 0 
        ? `https://media-assets.swiggy.com/swiggy/image/upload/${variations[0].images[0]}` 
        : '';

    return (
        <div className="swiggy-container">
            {imageUrl && <img src={imageUrl} alt={display_name} className="product-image" />}
            <h2 className="title">{display_name}</h2>
        </div>
    );
};

SwiggyContainer.propTypes = {
    data: PropTypes.shape({
        display_name: PropTypes.string.isRequired,
        variations: PropTypes.arrayOf(
            PropTypes.shape({
                images: PropTypes.arrayOf(PropTypes.string).isRequired
            })
        ).isRequired
    }).isRequired
};

export default SwiggyContainer;