import React from 'react';
import PropTypes from 'prop-types';
import '../css/Container.css'; // Updated CSS import

const Container = ({ data }) => {
    console.log(data);
    const { image, mrp, offer_price, title, brand,quantity } = data;

    return (
        <div className="card">
            <img src={image} alt={title} className="card-image" />
            <div className="card-content">
                <div className="card-prices">
                    <span className="card-mrp">₹{mrp}</span>
                    <span className="card-offer-price">₹{offer_price}</span>
                </div>
                <h2 className="card-title">{title}</h2>
                <p className="quantity">{quantity}</p>
            </div>
            <img src={brand} alt="Brand" className="brand-image" />
        </div>
    );
};

Container.propTypes = {
    data: PropTypes.shape({
        image: PropTypes.string.isRequired,
        mrp: PropTypes.number.isRequired,
        offer_price: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        brand: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
    }).isRequired,
};

export default Container;