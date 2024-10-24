import { useEffect } from "react";
import React from "react";
import { useState } from "react";



const adTexts = [
    "Ad Text 1: Buy one, get one free!",
    "Ad Text 2: 50% off on all items!",
    "Ad Text 3: Free shipping on orders over $50!",
    "Ad Text 4: New arrivals are here!",
    "Ad Text 5: Limited time offer, hurry up!"
];

const Carousel = () => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adTexts.length);
        }, 3000); // Change ad every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="carousel" >
            <p>{adTexts[currentAdIndex]}</p>
        </div>
    );
};
export default Carousel;